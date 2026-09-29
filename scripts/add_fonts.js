/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

const fs = require('fs');
let css = fs.readFileSync('app/font.css', 'utf8');
css = '@import url("https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@400;500;600;700&family=Bebas+Neue&display=swap");\n' + css;
fs.writeFileSync('app/font.css', css);
