import { expect, test } from "@playwright/test";

test("Reliability Lab executes live attacks and captures evidence", async ({ page }) => {
  // Navigate to Reliability Lab
  await page.goto("/reliability");
  
  // Verify initial state
  await expect(page.getByRole("heading", { name: "Reliability Lab" })).toBeVisible();
  await expect(page.getByText("No hard-coded scenario result is shown before a live run.")).toBeVisible();
  
  // Click Run Live Attacks
  await page.getByRole("button", { name: "RUN LIVE ATTACKS" }).click();
  
  // Wait for the run to complete (this tests the E2E bypass in requireOrganizationContext)
  // The summary footer changes to "Live run: X / 7 invariants held"
  await expect(page.locator("footer")).toContainText("Live run:", { timeout: 90000 });
  await expect(page.locator("footer")).toContainText("7 / 7 invariants held", { timeout: 90000 });
  
  // Check all 7 scenarios passed
  for (let i = 1; i <= 7; i++) {
    const id = String(i).padStart(2, "0");
    await expect(page.locator(`article:has-text("TEST ${id}")`).locator("strong")).toContainText("INVARIANT HELD");
  }
  
  // Expand evidence for Event tampering
  const eventTampering = page.locator('article:has-text("Event tampering")');
  await eventTampering.locator("summary").click();
  
  // Verify that evidence contains the tampered verification result
  await expect(eventTampering.locator("pre")).toContainText('"valid": false');
  
  // Navigate to the verifier to confirm persisted verifier state
  const verifyLink = page.locator('a[href="/verify"]');
  await verifyLink.click();
  
  // Wait for the verifier page to load
  await expect(page.getByRole("heading", { name: "Replay verifier" })).toBeVisible({ timeout: 15000 });
  
  // The verifier should be clean because the tampered event was rolled back during the test
  await expect(page.locator("body")).toContainText("STATE MATCH: YES");
});
