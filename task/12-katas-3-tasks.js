'use strict';

/**
 * Возвращает true если слово попадается в заданной головоломке.
 * Каждое слово может быть построено при помощи прохода "змейкой" по таблице вверх, влево, вправо, вниз.
 * Каждый символ может быть использован только один раз ("змейка" не может пересекать себя).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (первая строка)
 *   'REACT'     => true   (начиная с верхней правой R и дальше ↓ ← ← ↓)
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (первая колонка)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    puzzle.forEach(elem => elem = elem.split(''));

    function getNeighbours(point) {
        const neighbours = [];

        if (point.i != 0) {
            neighbours.push({i: point.i - 1, j: point.j});
        }
        if (point.j != 0) {
            neighbours.push({i: point.i, j: point.j - 1});
        }
        if (point.i != puzzle.length - 1) {
            neighbours.push({i: point.i + 1, j: point.j});
        }
        if (point.j != puzzle[0].length - 1) {
            neighbours.push({i: point.i, j: point.j + 1});
        }

        return neighbours;
    }

    function isSnakingString(point, string, trace) {
        if (string == '') {
            return true;
        }

        const neighbours = getNeighbours(point);
        let newTrace = trace;
        newTrace.push(point);
        for (let neighb of neighbours) {
            if (puzzle[neighb.i][neighb.j] == string[0] &&
                trace.find(elem => elem.i == neighb.i && elem.j == neighb.j) == undefined &&
                isSnakingString(neighb, string.slice(1), newTrace))
            {
                return true;
            }
        }
        return false;
    }

    const headCandidates = [];
    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[0].length; j++) {
            if (puzzle[i][j] == searchStr[0]) {
                headCandidates.push({i: i, j: j});
            }
        }
    }
    for (let candidate of headCandidates) {
        if (isSnakingString(candidate, searchStr.slice(1), [])) {
            return true;
        }
    }
    return false;
}


/**
 * Возвращает все перестановки заданной строки.
 * Принимаем, что все символы в заданной строке уникальные.
 * Порядок перестановок не имеет значения.
 *
 * @param {string} chars
 * @return {Iterable.<string>} все возможные строки, построенные из символов заданной строки
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    function permute(chars) {
        if (chars.length == 1) {
            return chars;
        } else if (chars.length == 2) {
            return [chars, chars[1] + chars[0]];
        } else {
            const permutations = [];
            chars.split('').forEach(
                function (char, index, array) {
                    let sub = [].concat(array);
                    sub.splice(index, 1);
                    permute(sub.join('')).forEach(
                        function (permutation) {
                            permutations.push(char + permutation);
                        });
                });
            return permutations;
        }
    }

    for (let permutation of permute(chars)) {
        yield permutation;
    }
}


/**
 * Возвращает наибольшую прибыль от игры на котировках акций.
 * Цены на акции храняться в массиве в порядке увеличения даты.
 * Прибыль -- это разница между покупкой и продажей.
 * Каждый день вы можете либо купить одну акцию, либо продать любое количество акций, купленных до этого, либо ничего не делать.
 * Таким образом, максимальная прибыль -- это максимальная разница всех пар в последовательности цен на акции.
 *
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (купить по 1,2,3,4,5 и затем продать все по 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (ничего не покупать)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (купить по 1,6,5 и затем продать все по 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let profit = 0;
    let i = quotes.length;

    while (--i && quotes[i] < quotes[i - 1]) {
        quotes.pop();
    }
    while (quotes.length) {
        const higher = quotes.reduce((higher, elem, index) => higher = elem > quotes[higher] ? index : higher, 0);
        for (i = 0; i < higher; i++) {
            profit += quotes[higher] - quotes[i];
        }
        quotes = quotes.slice(higher + 1);
    }

    return profit;
}


/**
 * Класс, предосатвляющий метод по сокращению url.
 * Реализуйте любой алгоритм, но не храните ссылки в хранилище пар ключ\значение.
 * Укороченные ссылки должны быть как минимум в 1.5 раза короче исходных.
 *
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {
    encode: function (url) {
        let key = urlStorage.store(url);

        if (!key) {
            return this.urlAllowedChars[0];
        }
        const short = [];
        const base = this.urlAllowedChars.length;
        while (key) {
            short.push(this.urlAllowedChars[key % base]);
            key /= base;
        }
        return short.reverse().join('');
    },

    decode: function (short) {
        const base = this.urlAllowedChars.length;
        let key = 0;
        for (let char of short) {
            key = key * base + this.urlAllowedChars.indexOf(char);
        }
        return urlStorage.access(key);
    }
}

function UrlStorage() {
   this.urls = new Map();
   this.key = 0;
}

UrlStorage.prototype = {
   store: function (url) {
       this.urls.set(this.key, url);
       return this.key++;
   },

   access: function (key) {
       return this.urls.get(key);
   }
};

const urlStorage = new UrlStorage();


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
