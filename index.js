const request = require('request');
const fs = require('fs');
require("chromedriver"); 

const swd = require("selenium-webdriver"); 
const browser = new swd.Builder(); 
const tab = browser.forBrowser("chrome").build(); 
//*[@id="pane-side"]/div[1]/div/div/div[1]

const getElementByXPath = xPath => new Promise((res, rej) => {
    const checkInp = setInterval(() => {
        tab.findElements(swd.By.xpath(xPath)).then(e => {
            // console.log(e)
            console.log('finding...')
            if (e.length !== 0) {
                clearInterval(checkInp);
                res(e[0]);
            }
        })
    }, 1000)
});

const sleep = mSec => new Promise((res, rej) => setTimeout(() => res(), mSec))

const init = async () => {
    await tab.get('https://web.whatsapp.com/'); 
    // const allChats = await getElementByClassName('_1MZWu');
    // const allChatsLength = allChats.length;

    const chat1 = await getElementByXPath('//*[@id="pane-side"]/div[1]/div/div/div[11]');
    const chat2 = await getElementByXPath('//*[@id="pane-side"]/div[1]/div/div/div[10]');
    const state = {
        count: 0,
        totalTime: 0,
        online: false,
        visited: false,
        left: false,
    };

    const state2 = {
        count: 0,
        totalTime: 0,
        online: false,
        visited: false,
        left: false,
    };

    const check = async () => {
        // 1
        await chat1.click();
        await sleep(2000);

        const status1 = await checkStatusIsOnline();

        if (status1 && !state.online) {
            // дата входа!
            const stamp = new Date();

            fs.appendFileSync('onlineList', `Visited: ${stamp.toLocaleString()} --------------------------------------- \n`);
            state.online = true;
            state.visited = stamp;
        }

        if (!status1 && state.online) {
            // дата выхода 
            const stamp = new Date();

            fs.appendFileSync('onlineList', `Left: ${stamp.toLocaleString()} \n`);
            state.online = false;
            state.left = stamp;
        }

        if (state.visited && state.left) {
            state.totalTime += state.left.getTime() - state.visited.getTime();
            state.visited = false;
            state.left = false;
            state.count += 1;

            fs.appendFileSync('onlineList', `Count: ${state.count} TotalTime ${new Date(state.totalTime).toGMTString().substring(17, 25)}\n`);
        }
        //////////////////////////////////////////////////////////////////////////////////////////////
        console.log(status1, '1')
        // if (state.online) {
        //     await chat2.click();
        //     await sleep(2000);
    
        //     const status2 = await checkStatusIsOnline();

        //     if (status2) {
        //         fs.appendFileSync('onlineList', '2-ONLINE \n');
        //     } else {
        //         fs.appendFileSync('onlineList', '2-OFFLINE \n');
        //     }
        // }


        if (true) {
            await chat2.click();
            await sleep(2000);
    
            const status2 = await checkStatusIsOnline();

            if (status2 && !state2.online) {
                // дата входа!
                const stamp = new Date();
    
                fs.appendFileSync('onlineList', `2) Visited: ${stamp.toLocaleString()} \n`);
                state2.online = true;
                state2.visited = stamp;
            }
    
            if (!status2 && state2.online) {
                // дата выхода 
                const stamp = new Date();
    
                fs.appendFileSync('onlineList', `2) Left: ${stamp.toLocaleString()} \n`);
                state2.online = false;
                state2.left = stamp;
            }
    
            if (state2.visited && state2.left) {
                state2.totalTime += state2.left.getTime() - state2.visited.getTime();

                state2.visited = false;
                state2.left = false;
                state2.count += 1;
    
                fs.appendFileSync('onlineList', `2) Count: ${state2.count} TotalTime ${new Date(state2.totalTime).toGMTString().substring(17, 25)} \n`);
            }
            console.log(status2, '2')
        }
        // await chat2.click();
        // await sleep(3000);

        // const status2 = await checkStatusIsOnline();

        // console.log(status2, '2')
        ////////////////////////////////////

        await sleep(3000)
        await check();
    }

    check()
}

const checkStatusIsOnline = async () => {
    const status = await tab.findElements(swd.By.xpath('//*[@id="main"]/header/div[2]/div[2]/span'))

    if (status.length) {
        const statusHtml = await status[0].getAttribute('innerHTML')

        return statusHtml === 'в сети'
    }
    return false;
}

init()

// tab.executeScript("alert()")

const consoleText = (text) => {
    console.log(`\n*-----------------------------------------------------------------*\n ${text}\n*-----------------------------------------------------------------*`);
}
