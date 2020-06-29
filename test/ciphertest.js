const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./test.sqlcipher');
const { app } = require('electron');

db.serialize(function() {
  db.run("PRAGMA KEY = 'secret'");
  // db.run("PRAGMA key = \"x'2DD29CA851E7B56E4697B0E1F08507293D761A05CE4D1B628663F411A8086D99'\"");
  db.run("PRAGMA CIPHER = 'aes-128-cbc'");
  db.run('CREATE TABLE messages(id INTEGER, user VARCHAR, msg TEXT)');
  db.run(
    'CREATE VIRTUAL TABLE messages_fts USING FTS4(user VARCHAR, msg TEXT)'
  );

  const stmt = db.prepare(
    'INSERT INTO messages(id, user, msg) VALUES (?, ?, ?)'
  );
  const messages = [
    [1, 'coolaj86', 'this is test message number one'],
    [2, 'ajthedj', 'this is test message number two'],
    [3, 'coolaj86', 'this is test message number three']
  ];
  messages.forEach(function(msg) {
    stmt.run(msg);
  });
  stmt.finalize();

  db.run('INSERT INTO messages_fts SELECT user, msg FROM messages');
  db.get(
    "SELECT * FROM messages INNER JOIN messages_fts ON messages.user = messages_fts.user WHERE messages_fts.msg MATCH 'one'",
    function(err, data) {
      if (err) {
        console.error(err);
        return;
      }

      console.log(data);
    }
  );
  db.all(
    "SELECT * FROM messages INNER JOIN messages_fts ON messages.user = messages_fts.user WHERE messages_fts.msg MATCH 'two'",
    function(err, data) {
      if (err) {
        console.error(err);
        return;
      }

      console.log(data);
    }
  );
  db.each(
    "SELECT * FROM messages INNER JOIN messages_fts ON messages.user = messages_fts.user WHERE messages_fts.msg MATCH 'message'",
    function(err, data) {
      if (err) {
        console.error(err);
        return;
      }

      console.log(data);
    }
  );
});

setTimeout(() => {
  app.quit();
}, 3000);
