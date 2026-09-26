const fs = require('fs');
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/api/patients/route.ts', 'utf8');

const oldPost = `    const db = await ensurePatientSchedulingSchema();
    
    const result = await db\`INSERT INTO patients (organization_id, full_name, date_of_birth, gender, contact_number, status, priority, age, blood_group, primary_complaint, email, address, emergency_contact, medical_history) 
      VALUES (\${context.organizationId}, \${fullName}, \${dob}, \${gender}, \${contact}, 'active', \${priority}, \${age}, \${bloodGroup}, \${primaryComplaint}, \${email}, \${address}, \${emergencyContact}, \${medicalHistory}) 
      RETURNING *\`;`;

const newPost = `    const db = await ensurePatientSchedulingSchema();
    const idempotencyKey = body.idempotencyKey || null;
    
    let result;
    if (idempotencyKey) {
       result = await db\`INSERT INTO patients (idempotency_key, organization_id, full_name, date_of_birth, gender, contact_number, status, priority, age, blood_group, primary_complaint, email, address, emergency_contact, medical_history) 
        VALUES (\${idempotencyKey}, \${context.organizationId}, \${fullName}, \${dob}, \${gender}, \${contact}, 'active', \${priority}, \${age}, \${bloodGroup}, \${primaryComplaint}, \${email}, \${address}, \${emergencyContact}, \${medicalHistory}) 
        ON CONFLICT (idempotency_key) DO UPDATE SET updated_at = NOW()
        RETURNING *\`;
    } else {
       result = await db\`INSERT INTO patients (organization_id, full_name, date_of_birth, gender, contact_number, status, priority, age, blood_group, primary_complaint, email, address, emergency_contact, medical_history) 
        VALUES (\${context.organizationId}, \${fullName}, \${dob}, \${gender}, \${contact}, 'active', \${priority}, \${age}, \${bloodGroup}, \${primaryComplaint}, \${email}, \${address}, \${emergencyContact}, \${medicalHistory}) 
        RETURNING *\`;
    }`;

text = text.replace(oldPost, newPost);
fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/api/patients/route.ts', text, 'utf8');
console.log('DONE');