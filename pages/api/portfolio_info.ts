import sqlite3 from "sqlite3";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    let db = new sqlite3.Database("./data/portfolio_data.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Connected to the database.`);
      }
    });

    db.run(
      `CREATE TABLE IF NOT EXISTS portfolio_data (
        portfolioId INTEGER PRIMARY KEY,
        portfolioName TEXT,
        assetName TEXT,
        amount REAL,
        price REAL,
        total REAL,
        at TEXT
    )`,
      err => {
        if (err) {
          console.error(err.message);
        } else {
          console.log("portfolio_data table created.");
        }
      },
    );

    const { portfolioName, assetName, amount, price, total, at } = req.body;
    db.run(
      `INSERT INTO portfolio_data(portfolioName, assetName, amount, price, total, at) VALUES(?, ?, ?, ?, ?, ?)`,
      [portfolioName, assetName, amount, price, total, at],
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
