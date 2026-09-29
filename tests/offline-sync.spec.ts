import { test, expect } from '@playwright/test';

test.describe('Offline Registration & Referral Sync', () => {
  test('Worker can register patient offline and sync to server', async ({ page }) => {
    // 1. Go to health worker view
    await page.goto('/health-worker/register');
    
    // 2. Simulate going offline
    await page.context().setOffline(true);
    
    // 3. Fill registration
    await page.fill('input[name="fullName"]', 'Offline Patient Test');
    await page.fill('input[name="dateOfBirth"]', '1980-01-01');
    await page.click('button[type="submit"]');
    
    // 4. Verify local cache fallback works
    await expect(page.locator('text=Saved offline')).toBeVisible();
    
    // 5. Simulate going online
    await page.context().setOffline(false);
    
    // 6. Trigger sync
    await page.goto('/health-worker');
    await page.click('button:has-text("Sync Now")');
    
    // 7. Verify sync success
    await expect(page.locator('text=Sync Complete')).toBeVisible();
  });
});
