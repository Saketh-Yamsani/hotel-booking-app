import {test,expect} from "@playwright/test"
import path from 'path';

const UI_URL="http://localhost:5173/"

test.beforeEach(async({page})=>{
    await page.goto(UI_URL);
    
      await page.getByRole("link",{name:"Sign In"}).click();
    
      await expect(page.getByRole("heading",{name:"Sign In"})).toBeVisible();
    
      await page.locator("[name=email]").fill("1@gmail.com");
      await page.locator("[name=password]").fill("qwertyuiop");
    
      await page.getByRole("button",{name:"Sign In"}).click();
    
      await expect(page.getByText("Sign In Successful")).toBeVisible();
});


test("should allow the user to add a hotel",async({page})=>{
    await page.goto(`${UI_URL}add-hotel`)

    await page.locator('[name="name"]').fill("Test Hotel");
    await page.locator('[name="city"]').fill("Test City");
    await page.locator('[name="country"]').fill("Test Country");
    await page.locator('[name="description"]').fill("This is a Test Description");
    await page.locator('[name="pricePerNight"]').fill("100");
    await page.selectOption('select[name="starRating"]',"3");

    await page.getByText("Budget").click();

    await page.getByLabel("Free Wifi").check();
    await page.getByLabel("Parking").check();
    
    await page.locator('[name="adultCount"]').fill("2");
    await page.locator('[name="childCount"]').fill("3");

    await page.setInputFiles('[name="imageFiles"]',[
        path.join(__dirname,"files","1.png"),
        path.join(__dirname,"files","2.png"),
        path.join(__dirname,"files","3.png"),
    ]);

    await page.getByRole('button',{name:"Save"}).click();

    await expect(page.getByText("Hotel Saved!")).toBeVisible();

});


test("should display hotels",async({page})=>{
    await page.goto(`${UI_URL}my-hotels`);

    await expect(page.getByText("Test Hotel").first()).toBeVisible();
    await expect(page.getByText("This is a Test Description").first()).toBeVisible();
    await expect(page.getByText("Test City, Test Country").first()).toBeVisible();
    await expect(page.getByText("Budget").first()).toBeVisible();
    await expect(page.getByText("$100 per night").first()).toBeVisible();
    await expect(page.getByText("2 adults, 3 children").first()).toBeVisible();
    await expect(page.getByText("3 Star Rating").first()).toBeVisible();

    await expect(page.getByRole("link",{name:"View Details"}).first()).toBeVisible();
    await expect(page.getByRole("link",{name:"Add Hotel"})).toBeVisible();



})

test("should edit hotel",async({page})=>{
    await page.goto(`${UI_URL}my-hotels`);

    await page.getByRole("link", { name: "View Details" }).first().click();

    await page.waitForSelector('[name="name"]',{state:"attached"})
    await expect(page.locator('[name="name"]')).toHaveValue('Test Hotel')
    await page.locator('[name="name"]').fill("Saketh Yamsani")
    await page.getByRole("button",{name:"Save"}).click();
    await expect(page.getByText("Hotel Saved!")).toBeVisible();

    await page.reload();

    await expect(page.locator('[name="name"]')).toHaveValue("Saketh Yamsani")
    await page.locator('[name="name"]').fill('Test Hotel');
    await page.getByRole("button",{name:"Save"}).click();


})