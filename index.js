const request = require('request');
const fs = require('fs');
require("geckodriver"); 


const readline = require('readline')
const swd = require("selenium-webdriver"); 

const tab = new swd.Builder().forBrowser("firefox").build() 
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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
   
rl.question('Write element id:  ', id => {
    init(id.trim())
    rl.close();
});

const init = async (id) => {
    await tab.get('https://web.whatsapp.com/'); 
    // const allChats = await getElementByClassName('_1MZWu');
    // const allChatsLength = allChats.length;

    const chat1 = await getElementByXPath(`//*[@id="pane-side"]/div[1]/div/div/div[${id}]`);

    const state = {
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


// tab.executeScript("alert()")
