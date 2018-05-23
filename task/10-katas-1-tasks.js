'use strict';

/**
 * Возвращает массив из 32 делений катушки компаса с названиями.
 * Смотрите детали здесь:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Пример возвращаемого значения :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    const sides = ['N','E','S','W'];
    const points = [];

    let middleAzimuth = 0.00;
    function getCompassPoint(abbreviation, azimuth) {
        const point = {
            abbreviation: abbreviation,
            azimuth: azimuth
        };
        middleAzimuth += 360 / 32;

        return point;
    }

    for (let i = 0; i < sides.length; i++) {
        const next = (i == sides.length - 1) ? sides[0] : sides[i + 1];
        const side = sides[i];
        const isEven = !(i % 2);

        points.push(getCompassPoint(`${side}`, middleAzimuth));
        points.push(getCompassPoint(`${side}b${next}`, middleAzimuth));
        points.push(getCompassPoint(isEven ? `${side}${side}${next}` :
            `${side}${next}${side}`, middleAzimuth));
        points.push(getCompassPoint(isEven ? `${side}${next}b${side}` :
            `${next}${side}b${side}`, middleAzimuth));
        points.push(getCompassPoint(isEven ? `${side}${next}` :
            `${next}${side}`, middleAzimuth));
        points.push(getCompassPoint(isEven ? `${side}${next}b${next}` :
            `${next}${side}b${next}`, middleAzimuth));
        points.push(getCompassPoint(isEven ? `${next}${side}${next}` :
            `${next}${next}${side}`, middleAzimuth));
        points.push(getCompassPoint(`${next}b${side}`, middleAzimuth));
    }

    return points;
}


/**
 * Раскройте фигурные скобки указанной строки.
 * Смотрите https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * Во входной строке пары фигурных скобок, содержащие разделенные запятыми подстроки,
 * представляют наборы подстрок, которые могут появиться в этой позиции на выходе.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * К СВЕДЕНИЮ: Порядок выходных строк не имеет значения.
 *
 * Пример:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    let expanded = [str];

    const bracedSubstringRegex = /\{[^\{\}]*?\}/g;

    let hasFinished = false;
    while (!hasFinished) {
        hasFinished = true;
        let newExpanded = [];

        for (let string of expanded) {
            let matches = string.match(bracedSubstringRegex);
            if (matches) {
                hasFinished = false;
                let options = matches[0].slice(1, -1).split(',');
                for (let option of options) {
                    newExpanded.push(string.replace(matches[0], option));
                }
            } else {
                newExpanded.push(string);
            }
        }
        expanded = newExpanded;
    }
    expanded = [...new Set(expanded)];

    for (let string of expanded) {
        yield string;
    }
}


/**
 * Возвращает ZigZag матрицу
 *
 * Основная идея в алгоритме сжатия JPEG -- отсортировать коэффициенты заданного изображения зигзагом и закодировать их.
 * В этом задании вам нужно реализовать простой метод для создания квадратной ZigZag матрицы.
 * Детали смотрите здесь: https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * https://ru.wikipedia.org/wiki/JPEG
 * Отсортированные зигзагом элементы расположаться так: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - размер матрицы
 * @return {array}  массив размером n x n с зигзагообразным путем
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    const Moves = Object.freeze({up: 0, down: 1});

    let matrix = Array.from({length: n}, () => Array.from({length: n}, () => 0));

    let i = 0;
    let j = 0;
    let elem = 1;
    let movement = Moves.up;
    while (elem < n * n) {
        switch (movement) {
            case Moves.down:
                if (j && i != n - 1) {
                    i++;
                    j--;
                } else {
                    if (i == n - 1) {
                        j++;
                    } else {
                        i++;
                    }
                    movement = Moves.up;
                }
                break;
            case Moves.up:
                if (i && j != n - 1) {
                    i--;
                    j++;
                } else {
                    if (j == n - 1) {
                        i++;
                    } else {
                        j++;
                    }
                    movement = Moves.down;
                }
                break;
        }
        matrix[i][j] = elem++;
    }

    return matrix;
}


/**
 * Возвращает true если заданный набор костяшек домино может быть расположен в ряд по правилам игры.
 * Детали игры домино смотрите тут: https://en.wikipedia.org/wiki/Dominoes
 * https://ru.wikipedia.org/wiki/%D0%94%D0%BE%D0%BC%D0%B8%D0%BD%D0%BE
 * Каждая костяшка представлена как массив [x,y] из значений на ней.
 * Например, набор [1, 1], [2, 2], [1, 2] может быть расположен в ряд ([1, 1] -> [1, 2] -> [2, 2]),
 * тогда как набор [1, 1], [0, 3], [1, 4] не может.
 * К СВЕДЕНИЮ: в домино любая пара [i, j] может быть перевернута и представлена как [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    const result = [[]];
    result[0] = dominoes.shift();

    let lastLength = 0;
    while (lastLength != dominoes.length && dominoes.length > 0) {
        lastLength = dominoes.length;
        for (let i = 0; i < dominoes.length; i++) {
            if (result[result.length - 1][1] == dominoes[i][0] && result[result.length - 1][0] != dominoes[i][1]) {
                result[result.length] = dominoes[i];
                dominoes.splice(i, 1);
            } else if (result[result.length - 1][1] == dominoes[i][1] && result[result.length - 1][0] != dominoes[i][1]) {
                result[result.length] = dominoes[i].reverse();
                dominoes.splice(i, 1);
            }
        }
    };

    return !dominoes.length;
}


/**
 * Возвращает строковое представление заданного упорядоченного списка целых чисел.
 *
 * Строковое представление списка целых чисел будет состоять из элементов, разделенных запятыми. Элементами могут быть:
 *   - отдельное целое число
 *   - или диапазон целых чисел, заданный начальным числом, отделенным от конечного числа черточкой('-').
 *     (Диапазон включает все целые числа в интервале, включая начальное и конечное число)
 *     Синтаксис диапазона должен быть использован для любого диапазона, где больше двух чисел.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    return nums.reduce(
        function (acc, elem, index) {
            if (acc.length > 0) {
                const last = acc[acc.length - 1].split('-');
                if (last.length > 1) {
                    if (elem - parseInt(last[1]) < 2) {
                        acc.pop();
                        acc.push(`${last[0]}-${elem}`);
                        return acc;
                    }
                }

                if (acc.length > 1) {
                    const beforeLast = acc[acc.length - 2];
                    if (beforeLast.split('-').length == 1 && elem - parseInt(beforeLast) == 2) {
                        acc.pop();
                        acc.push(`${acc.pop()}-${elem}`);
                        return acc;
                    }
                }
            }
            acc.push(elem.toString());
            return acc;
        }, []).toString();
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
