const fs = require('fs');
const path = require('path');

const srcPath = 'C:/Users/HP/Downloads/u495202283_phydb.sql';
let sql = fs.readFileSync(srcPath, 'utf8');

// 1. Fix line 506 broken comment: single dash followed by hyphens -> double dash comment
sql = sql.replace(/\r?\n-\s*-+/g, '\n-- --------------------------------------------------------');

// 2. Add DROP TABLE IF EXISTS before every CREATE TABLE
sql = sql.replace(/CREATE TABLE `([^`]+)`/g, 'DROP TABLE IF EXISTS `$1`;\nCREATE TABLE `$1`');

// 3. Wrap with foreign key checks disable at top and enable at bottom
const header = '-- ========================================================\n' +
               '-- Cleaned & Fixed Database Export for Hostinger phpMyAdmin\n' +
               '-- ========================================================\n' +
               'SET NAMES utf8mb4;\n' +
               'SET FOREIGN_KEY_CHECKS = 0;\n\n';

const footer = '\n\nSET FOREIGN_KEY_CHECKS = 1;\nCOMMIT;\n';

const finalSql = header + sql + footer;

// Write output
const out1 = 'C:/Users/HP/Downloads/u495202283_phydb_FIXED.sql';
const out2 = path.join(__dirname, 'u495202283_phydb_FIXED.sql');

fs.writeFileSync(out1, finalSql, 'utf8');
fs.writeFileSync(out2, finalSql, 'utf8');

console.log('Successfully generated fixed SQL at:');
console.log('1.', out1);
console.log('2.', out2);

const drops = finalSql.match(/DROP TABLE IF EXISTS `[^`]+`;/g);
console.log('Verified dropped tables count:', drops ? drops.length : 0);
console.log('Tables:', drops);
