/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

const { neon } = require('@neondatabase/serverless');
async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Skipping seed.");
    return;
  }
  
  console.log("Connecting to Neon Database for Seeding...");
  const sql = neon(connectionString);
  
  console.log("Seeding Doctors...");
  await sql`
    INSERT INTO doctors (organization_id, full_name, specialty, role, shift_start, shift_end, location)
    VALUES 
    ('city-care', 'Dr. Arindam Bose', 'Neurology', 'Head of Department', '09:00:00', '17:00:00', 'Ward A'),
    ('city-care', 'Dr. Sneha Rao', 'General Medicine', 'Consultant', '08:00:00', '16:00:00', 'OPD 1')
    ON CONFLICT DO NOTHING;
  `;
  console.log("Seeding Nurses...");
  await sql`
    INSERT INTO nurses (organization_id, full_name, role, ward, shift_start, shift_end, patient_load)
    VALUES 
    ('city-care', 'Sister Kavita', 'Head Nurse', 'Neurology Ward', '07:00:00', '15:00:00', 12),
    ('city-care', 'Brother Anil', 'Staff Nurse', 'General Ward', '15:00:00', '23:00:00', 8)
    ON CONFLICT DO NOTHING;
  `;
  console.log("Seeding Inventory...");
  await sql`
    INSERT INTO inventory_items (name, sku, category, quantity, reorder_level, unit)
    VALUES 
    ('Paracetamol 500mg', 'MED-PAR-001', 'pharmacy', 5000, 1000, 'tablet'),
    ('MRI Contrast Agent', 'MED-MRI-002', 'pharmacy', 50, 20, 'vial'),
    ('Surgical Masks', 'EQP-MSK-003', 'equipment', 10000, 2000, 'box')
    ON CONFLICT DO NOTHING;
  `;
  console.log("Clinical Data Seeded Successfully!");
}
seed().catch(console.error);
