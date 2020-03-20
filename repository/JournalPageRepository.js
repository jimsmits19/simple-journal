class JournalPageRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS JournalPages (
          id INTEGER,
          version INTEGER,
          text TEXT, 
          PRIMARY KEY (id, version))`
        return this.dao.run(sql)
    }

    create(id, version, text) {
        return this.dao.run(
            `INSERT INTO JournalPages (id, version, text)
            VALUES (?, ?, ?)`,
            [id, version, text])
    }

    update(id, version, entry) {
        throw new Error('updating journal entries is not supported.');
        // return this.dao.run(
        //     `UPDATE JournalPages
        //   SET entry = ?
        //   WHERE version = ? AND id = ?`,
        //     [entry, version, id]
        // )
    }

    delete(id) {
        throw new Error("deleting from the journal is verboten.");
        // return this.dao.run(
        //     `DELETE FROM JournalPages WHERE id = ?`,
        //     [id]
        // )
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM JournalPages WHERE id = ? ORDER BY version DESC LIMIT 1`, [id]
        )
    }

    getField(fieldName) {
        //POSSIBLE SQL Injection vector.  - fieldName should never accept user input. 
        //There is probably a way to use '?' syntax as one would with a where param, but I am too lazy to look right now.
        //TODO: stop being lazy ;)
        return this.dao.all(
            `SELECT DISTINCT ${fieldName} FROM JournalPages`
        )
    }

}

module.exports = JournalPageRepository;