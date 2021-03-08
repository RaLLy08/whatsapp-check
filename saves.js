const request = require('request');
require("chromedriver"); 

const swd = require("selenium-webdriver"); 
const browser = new swd.Builder(); 
const tab = browser.forBrowser("chrome").build(); 

const wp = tab.get('https://web.whatsapp.com/');

wp.then(() => { 
    const waitChat = () => new Promise((res, rej) => {
        const checkInp = setInterval(() => {
            tab.findElements(swd.By.xpath('//*[@id="main"]/footer/div[1]/div[2]/div/div[2]')).then(e => {
                if (e.length !== 0) {
                    clearInterval(checkInp);
                    res();
                }
            })
        }, 500)
        checkInp().then(e => tab.executeScript("alert()"))
    })

    waitChat().then(() => tab.executeScript(`document.querySelector("#main > footer > div._3ee1T._1LkpH.copyable-area > div._3uMse > div > div._3FRCZ.copyable-text.selectable-text").inne`))
})


// tab.executeScript("alert()")

const consoleText = (text) => {
    console.log(`\n*-----------------------------------------------------------------*\n ${text}\n*-----------------------------------------------------------------*`);
}
