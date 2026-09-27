import {test,expect} from "@playwright/test";

test("runs attribution, inspects evidence and copies the report",async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Run attribution"}).click();
  await expect(page.getByText("$18,840")).toBeVisible();
  await page.getByRole("button",{name:"Inspect"}).first().click();
  await expect(page.getByRole("dialog",{name:"Video evidence"})).toBeVisible();
  await page.getByRole("button",{name:"Close evidence"}).click();
  await page.getByRole("button",{name:"Copy broker report"}).click();
  await expect(page.getByRole("button",{name:"Report copied"})).toBeVisible();
});

test("shows a named empty-window error",async({page})=>{
  await page.goto("/");
  await page.getByLabel("Listing",{exact:true}).selectOption("L-208");
  await page.getByLabel("Attribution window").fill("7");
  await page.getByRole("button",{name:"Run attribution"}).click();
  await expect(page.getByText("CRM leads")).toBeVisible();
  await page.getByLabel("Attribution window").fill("2");
  await page.getByRole("button",{name:"Run attribution"}).click();
  await expect(page.locator("p.error")).toContainText("7 to 90 days");
});

test("reset restores defaults and mobile has no page overflow",async({page})=>{
  await page.goto("/");
  await page.getByLabel("Listing",{exact:true}).selectOption("L-311");
  await page.getByRole("button",{name:"Reset attribution"}).click();
  await expect(page.getByLabel("Listing",{exact:true})).toHaveValue("L-104");
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
