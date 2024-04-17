import sqlite3 from "sqlite3";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    let db = new sqlite3.Database("./data/api_info.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Connected to the database.`);
      }
    });

    db.run(
      `CREATE TABLE IF NOT EXISTS user_data (
      portfolioName TEXT,
      api TEXT,
      apiSecret TEXT
    )`,
      err => {
        if (err) {
          console.error(err.message);
        } else {
          console.log("user_data table created.");
        }
      },
    );

    const { portfolioName, api, apiSecret } = req.body;
    db.run(
      `INSERT INTO user_data(portfolioName, api, apiSecret) VALUES(?, ?, ?)`,
      [portfolioName, api, apiSecret],
      function (err) {
        if (err) {
          return console.error(err.message);
        }
        res.status(200).json({ message: "Success", rowId: this.lastID });
      },
    );

    db.close(err => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Closed the database connection.");
      }
    });
  } else {
    res.status(200).json({ message: "Not a POST request" });
  }
}
