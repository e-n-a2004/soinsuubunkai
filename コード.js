/**
 * ウェブアプリを表示するための基本関数
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate()
    .setTitle('素数判定 & 素因数分解ツール')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * 画面上の入力、またはスプレッドシートの数値を処理するメインロジック
 */
function analyzeNumber(num) {
  num = parseInt(num);
  if (isNaN(num) || num < 2) {
    return { error: "2以上の整数を入力してください。" };
  }

  const factors = getPrimeFactors(num);
  const isPrime = factors.length === 1;

  return {
    num: num,
    isPrime: isPrime,
    factors: factors.join(' × ')
  };
}

/**
 * スプレッドシートの2行目以降を一括処理する関数
 */
function processSheetData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow < 2) return "処理するデータ（2行目以降）が見つかりません。";

  const range = sheet.getRange(2, 1, lastRow - 1, 1);
  const values = range.getValues();
  const results = [];

  for (let i = 0; i < values.length; i++) {
    let res = analyzeNumber(values[i][0]);
    if (res.error) {
      results.push(["対象外", "-"]);
    } else {
      results.push([res.isPrime ? "素数" : "素数ではない", res.factors]);
    }
  }

  sheet.getRange(2, 2, results.length, 2).setValues(results);
  return (lastRow - 1) + "件の処理が完了しました。";
}

/**
 * 素因数分解の計算アルゴリズム
 */
function getPrimeFactors(n) {
  const factors = [];
  let d = 2;
  let temp = n;
  while (temp >= d * d) {
    if (temp % d === 0) {
      factors.push(d);
      temp /= d;
    } else {
      d++;
    }
  }
  if (temp > 1) factors.push(temp);
  return factors;
}