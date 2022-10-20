import { connection } from "../database/db.js";

async function hashtagList() {
    const list = await connection.query(`SELECT 
    MAX("hashtagId") AS "id", 
    name, 
    COUNT(*) AS "postCount" 
    FROM posthashtag 
    LEFT JOIN hashtags 
    ON posthashtag."hashtagId" = hashtags.id 
    GROUP BY name 
    ORDER BY "postCount" DESC 
    LIMIT 10;
    `);

    return list.rows;
  };

async function isThereHashtag(str){
    const hashtags = await connection.query(
        `SELECT * FROM hashtags WHERE name = $1;`,
        [str]);
    
    if(hashtags.rowCount > 0){
        return true;
    }else return false;

};

async function addHashtag(str){
    await connection.query(
        `INSERT INTO hashtags (name) VALUES($1);`,
        [str]);
    
}

export {hashtagList, isThereHashtag, addHashtag};