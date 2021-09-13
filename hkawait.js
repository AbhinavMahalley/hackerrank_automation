//'use strict';
const loginLink = "https://www.hackerrank.com/auth/login";
const emailpassObj = require("./secrets");
const {answers} = require("./codes");
const puppeteer = require("puppeteer")
// creates headless browser

let page, browser;
(async function fn() {
    try {
        let browserStartPromise =await puppeteer.launch({
            // visible 
            headless: false,
            // type 1sec // slowMo: 1000,
            defaultViewport: null,
            // browser setting 
            args: ["--start-maximized", "--disable-notifications"]
        })
        let browserObj = browserStartPromise;
        console.log("Browser opened");
        browser = browserObj
        // new tab 
        page = await browserObj.newPage();
        await page.goto(loginLink);
        await page.type("input[id='input-1']", emailpassObj.email, { delay: 50 });
        await page.type("input[type='password']", emailpassObj.password, { delay: 50 });
        await page.click('button[data-analytics="LoginPassword"]', { delay: 100 });
        await waitAndClick(".track-card a[data-attr2='algorithms']", page);
        await waitAndClick("input[value='warmup']", page);
        await page.waitForTimeout(3000);
        let questionsArr = await page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled", { delay: 100 });
        console.log(questionsArr.length);
        for (let i = 0; i < questionsArr.length; i++) {
          
            await questionSolver(page,questionsArr[i] , answers[i]);
            await page.waitForSelector(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled",{visible:true});
            console.log("que "+ i);
        }
    } catch (err) {
        
        console.log(err);
    }

})()




// n number of question first 

async function waitAndClick(selector,cPage) {
    try {
        await cPage.waitForSelector(selector, { visible: true });
        await cPage.click(selector,{delay:100});
        // console.log("done");
    }
    catch (err) {
        return new Error(err);
    }
}

async function questionSolver(page, question, answer) {
   try {
        await question.click();
        await waitAndClick(".monaco-editor.no-user-select.vs", page);
        await waitAndClick(".checkbox-input", page);
        await page.waitForSelector("textarea.custominput", { visible: true });
        await page.type("textarea.custominput", answer, { delay: 10 });
            await page.keyboard.down("Control");
             await page.keyboard.press("A", { delay: 100 });
               await page.keyboard.press("X", { delay: 100 });
            await page.keyboard.up("Control");
                await  waitAndClick(".monaco-editor.no-user-select.vs", page);
               await page.keyboard.down("Control");
                await page.keyboard.press("A", { delay: 100 });
               await page.keyboard.press("V", { delay: 100 });
                await page.keyboard.up("Control");
                await page.click(".hr-monaco__run-code", { delay: 50 });
            await page.waitForSelector(".code-compile-test-view.theme-m-content");
            await page.goBack();
            return;
    }catch(err){
        return new Error(err);
    }
}