import session from "express-session";
import pool from "./db.js";

// Armazena as sessões no próprio TiDB/MySQL. Isso evita depender do MemoryStore,
// que não é apropriado para uma aplicação distribuída/serverless como a Vercel.
class MySQLSessionStore extends session.Store {
    get(sid, callback) {
        pool.execute(
            "SELECT data, expires FROM sessions WHERE sid = ? LIMIT 1",
            [sid]
        )
            .then(async ([rows]) => {
                if (!rows.length || Number(rows[0].expires) <= Date.now()) {
                    if (rows.length) {
                        await pool.execute("DELETE FROM sessions WHERE sid = ?", [sid]);
                    }
                    return callback(null, null);
                }

                try {
                    return callback(null, JSON.parse(rows[0].data));
                } catch (error) {
                    return callback(error);
                }
            })
            .catch(callback);
    }

    set(sid, sess, callback) {
        const expires = this.getExpiration(sess);
        const data = JSON.stringify(sess);

        pool.execute(
            `INSERT INTO sessions (sid, expires, data)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE expires = VALUES(expires), data = VALUES(data)`,
            [sid, expires, data]
        )
            .then(() => callback?.(null))
            .catch(error => callback?.(error));
    }

    destroy(sid, callback) {
        pool.execute("DELETE FROM sessions WHERE sid = ?", [sid])
            .then(() => callback?.(null))
            .catch(error => callback?.(error));
    }

    touch(sid, sess, callback) {
        const expires = this.getExpiration(sess);

        pool.execute(
            "UPDATE sessions SET expires = ? WHERE sid = ?",
            [expires, sid]
        )
            .then(() => callback?.(null))
            .catch(error => callback?.(error));
    }

    getExpiration(sess) {
        if (sess?.cookie?.expires) {
            const timestamp = new Date(sess.cookie.expires).getTime();
            if (Number.isFinite(timestamp)) return timestamp;
        }

        const maxAge = Number(sess?.cookie?.maxAge || 60 * 60 * 1000);
        return Date.now() + maxAge;
    }
}

export default MySQLSessionStore;
