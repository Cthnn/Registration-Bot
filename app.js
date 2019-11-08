
const puppeteer = require('puppeteer');


function getText(linkText) {
  linkText = linkText.replace(/\r\n|\r/g, "\n");
  linkText = linkText.replace(/\ +/g, " ");

  // Replace &nbsp; with a space 
  var nbspPattern = new RegExp(String.fromCharCode(160), "g");
  return linkText.replace(nbspPattern, " ");
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://psns.cc.stonybrook.edu/psp/csprods/EMPLOYEE/CAMP/?cmd=login');
  await page.type('#userid','');
  await page.type('#pwd','');
  await Promise.all([
    page.click('input[name="Submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ]);
  var enrollment;
  var links = await page.$$('a');
  for(var i = 0; i < links.length;i++){
    let valueHandle = await links[i].getProperty('innerText');
    let linkText = await valueHandle.jsonValue();
    const text = getText(linkText);
    if(text == 'Enrollment'){
      enrollment = links[i];
      break;
    }
  }
  await Promise.all([
    enrollment.click(),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ]);
  await page.screenshot({path: 'example.png'});
  await browser.close();
})();



