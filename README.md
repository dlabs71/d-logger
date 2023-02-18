# D-logger

Библиотека для ведения журнала логирования JS/Vue приложений.

[![NPM Version][npm-image]][npm-url]
[![License][license-image]][license-url]

# Установка NPM

```sh
npm i @dlabs71/d-logger
```

# Использование

Данная библиотека может быть использована в любом js приложении, вне зависимости от фреймворка. Также она предоставляет
поддержку подключения к Vue.js приложению через плагин. Для использования в Node или Electron приложениях, где
необходимо логирование в файл, используйте библиотеку [**@dlabs71/d-logger-node**](https://github.com/dlabs71/d-logger-node#readme).

## Подключение к Vue.js приложению

Для использования d-logger во Vue приложении, импортируйте `DLoggerPlugin` плагин и подключите его.

**`main.js`**

```js
import DLoggerPlugin from '@dlabs71/d-logger';

Vue.use(DLoggerPlugin);
// or
const loggerOpts = {
    level: "info"
};
Vue.use(DLoggerPlugin, {
    logConfig: loggerOpts
});
```

Параметры настройки плагина:

| **Параметр** | **Тип**   | **Значение по умолчанию** | **Описание**
| :------------| :---------| :-------------------------| :-------------------------------------
| level        | string    | debug                     | Устанавливает уровень логирования | 
| template     | function  | null                      | Функция определяющая шаблон строки логирования ([шаблоны](#section31)) | 
| appenders    | array     | []                        | Список апендеров, реализующих класс `LogAppender`. По умолчанию сразу доступен `ConsoleAppender` ([аппендеры](#section2))|
| stepInStack  | number    | 6                         | Индекс в стеке вызовов ошибки для определения файла и позиции вызова метода логирования. Если библиотека показывает не верный файл вызова метода логирования, то необходимо поменять данный параметр.
| dateL10n     | string    | en                        | Локализация даты в логах (en, ru, ...). Для всех аппендеров по умолчанию. |

Далее вы можете использовать её через `this.$log` как в примере ниже:

**`example.vue`**

```vue

<template></template>
<script>
export default {
    name: 'example',
    methods: {
        process() {
            this.$log.debug("Starting method process");
            // code method
            this.$log.debug("Ending method process");
        }
    }
}
</script>
```

## Использование логгера без плагина Vue.js

Для использования логгера без плагина Vue.js достаточно импортировать `$log` из `d-logger`. Вы получаете, настроенный по
умолчанию, экземпляр класса DLogger. Он будет использовать `ConsoleAppender` в качестве единственного и основного
аппендера логирования ([Логгер](#section2)).

```js
import {$log} from '@dlabs71/d-logger';

function exampleFunc(param1, param2) {
    $log.info("Start exampleFunc with parameters: param1 = ", param1, ", param2 = ", param2);
}
```

Логгер можно перенастроить, для этого есть метод `configure`. Про его использование читайте в
документации [Метод configure](#section221).

```js
import {$log} from '@dlabs71/d-logger';

$log.configure({
    level: "error"
});

function exampleFunc(param1, param2) {
    $log.info("Start exampleFunc with parameters: param1 = ", param1, ", param2 = ", param2);
}
```

# Документация

## Оглавление

* [1. Уровни логирования](#section1)
* [2. Логгер](#section2)
    * [2.1 Методы логирования](#section21)
    * [2.2 Методы конфигурации и управления аппендерами](#section22)
        * [2.2.1 Метод configure](#section221)
        * [2.2.2 Метод clearAppenders](#section222)
        * [2.2.3 Метод addConsoleAppender](#section223)
        * [2.2.4 Метод addCustomAppender](#section224)
    * [2.3 Вспомогательные методы логгера](#section23)
        * [2.3.1 Метод logProcessEnvs](#section231)
        * [2.3.2 Метод dprsValue](#section232)
        * [2.3.3 Метод dprsObj](#section233)
        * [2.3.4 Метод len](#section234)
* [3. Вспомогательные функции](#section3)
    * [3.1 Шаблоны события логирования](#section31)

## <h2 id="section1">1. Уровни логирования</h2>

| **Уровень логирования** | **Приоритет** | **Цвет**     |
| :-----------------------| :-------------| :------------|
| emerg                   | 0             | red          |
| alert                   | 1             | orange       |
| crit                    | 2             | red          |
| error                   | 3             | red          |
| warn                    | 4             | yellow       |
| warning                 | 4             | yellow       |
| notice                  | 5             | blue         |
| info                    | 6             | green        |
| debug                   | 7             | rainbow      |

> Чем больше значение приоритета, тем больше уровней логирования будут отображаться.
> - **0** - будут отображаться только логи с уровнем **emerg**.
> - **7** - будут отображаться все уровни логирования
>
> **warn** и **warning** - это два одинаковых уровня логирования "предупреждение". Создано для удобства использования

## <h2 id="section2">2. Логгер</h2>

Логгер представляет собой экземпляр класса `DLogger`. Для управления журналом логирования существуют специальные классы,
наследующие класс `LogAppender` (далее аппендеры). Из коробки доступена 1 реализация:

* `ConsoleAppender` - аппендер делегирующий управление журналов логирования реализации `console`

Также доступен аппендер для логирования в файл `FileAppender`. 
Для этого воспользуйтесь библиотекой [**@dlabs71/d-logger-node**](https://github.com/dlabs71/d-logger-node#readme)

### <h3 id="section21">2.1 Методы логирования</h3>

Логгер предоставляет методы соответствующие каждому из уровней логирования. Параметрами является массив значений любого
типа.

**`example.js`**

```js
import {$log} from '@dlabs71/d-logger';

function exampleFunc(param1, param2) {
    $log.info("Start exampleFunc with parameters: param1 = ", param1, ", param2 = ", param2);
}
```

Если параметром метода логирования будет являться функция, то при вызове метода она выполниться, а результат будет
конвертирован в строку. Когда параметр является объектом или массивом то значение будет преобразовано в строку при
помощи `JSON.stringify`.

### <h3 id="section22">2.2 Методы конфигурации и управления аппендерами</h3>

#### <h4 id="section221">2.2.1 Метод configure</h4>

Логгер предоставляет метод конфигурации `configure`. Данный метод принимает объект с параметрами конфигурации, описанные
в таблице ниже.

| **Параметр** | **Тип**   | **Значение по умолчанию** | **Описание**
| :------------| :---------| :-------------------------| :-------------------------------------
| level        | string    | debug                     | устанавливает уровень логирования
| template     | function  | null                      | Функция определяющая шаблон строки логирования сразу для всех аппендеров ([шаблоны](#section31)).
| appenders    | array     | []                        | Список аппендеров реализующих класс `LogAppender`. По умолчанию сразу устанавливается `ConsoleAppender`
| stepInStack  | number    | 6                         | Индекс в стеке вызовов ошибки для определения файла и позиции вызова метода логирования. Если библиотека показывает не верный файл вызова метода логирования, то необходимо поменять данный параметр.
| dateL10n     | string    | en                        | Локализация даты в логах (en, ru, ...). Для всех аппендеров по умолчанию. |

Пример использования:

```js
import {$log} from '@dlabs71/d-logger';

$log.configure({
    level: "error"
});
```

#### <h4 id="section222">2.2.2 Метод clearAppenders</h4>

Метод предназначен для очищения списка аппендеров.

Пример использования:

```js
import {$log} from '@dlabs71/d-logger';

$log.clearAppenders();
```

#### <h4 id="section223">2.2.3 Метод addConsoleAppender</h4>

Метод для добавления `ConsoleAppender`. Параметры функции описаны в таблице ниже

| **Параметр** | **Тип**  | **Значение по умолчанию**   | **Описание**
| :------------| :--------| :---------------------------| :-------------------------------------
| level        | string   | null                        | Устанавливает уровень логирования аппендера
| colorize     | boolean  | true                        | Использовать цвет логирования
| template     | function | null                        | Функция определяющая шаблон строки логирования аппендера ([шаблоны](#section31)).
| stepInStack  | number   | config.stepInStack          | Индекс в стеке вызовов ошибки для определения файла и позиции вызова метода логирования. Если библиотека показывает не верный файл вызова метода логирования, то необходимо поменять данный параметр.
| dateL10n     | string    | en                        | Локализация даты в логах (en, ru, ...).  |

Пример использования:

```js
import {$log} from '@dlabs71/d-logger';

$log.addConsoleAppender("debug", true);
```

#### <h4 id="section224">2.2.4 Метод addCustomAppender</h4>

Метод для добавления собственной реализации аппендера. Он должен наследовать `LogAppender` класс.

Пример использования:

```js
import {$log, LogAppender} from '@dlabs71/d-logger';

class CustomAppender extends LogAppender {

    constructor() {
        super({});
    }

    log(strings, level = null, stepInStack = null, dateL10n = null) {
        const message = this.creatingMessage(strings, level, stepInStack, dateL10n);
        // реализация данного метода
        return message
    }
}

$log.addCustomAppender(new CustomAppender());
```

### <h3 id="section23">2.3 Вспомогательные методы логгера</h3>

#### <h4 id="section231">2.3.1 Метод logProcessEnvs</h4>

Метод для печати в журнал логов всех переменных окружения (`process.env`)

Пример использования:

```js
import {$log} from '@dlabs71/d-logger';

$log.logProcessEnvs();

//  Process envs:
//  VUE_APP_NODE_ENV=development;
//  VUE_APP_LOG_ENABLED=true;
//  VUE_APP_LOG_LEVEL=debug;
//  VUE_APP_LOG_FILE=true;
//  VUE_APP_LOG_FILE_PREFIX=app;
//  VUE_APP_LOG_FILE_COUNT=5;
//  VUE_APP_STORE_SECRET=345;
//  NODE_ENV=development;
//  BASE_URL=/;
//  IS_ELECTRON=true;
```

#### <h4 id="section232">2.3.2 Метод dprsValue</h4>

Метод для обезличивания строки

Пример использования:

```js
import {$log} from '@dlabs71/d-logger';

$log.dprsValue("qwerty$4", "password");
// return "password:8"

$log.dprsValue(null, "password");
// return "password:null"

$log.dprsValue(undefined, "password");
// return "password:undefined"
```

#### <h4 id="section233">2.3.3 Метод dprsObj</h4>

Метод для обезличивания полей в объекте

Пример использования:

```js
import {$log} from '@dlabs71/d-logger';

$log.dprsValue({
    login: "daivanov",
    password: "qwerty$4",
    secretKey: "123"
});
// return {
//      login: "daivanov",
//      password: "password:8",
//      secretKey: "secretKey:3"
// }
```

#### <h4 id="section234">2.3.4 Метод len</h4>

Метод для получения длины строки. Если параметр `null` или `undefined`, то возвращает соответствующее значение

Пример использования:

```js
import {$log} from '@dlabs71/d-logger';

$log.len("qwerty$4");
// return 8

$log.len(null);
// return null

$log.len(undefined);
// return undefined
```

## <h2 id="section3">3. Вспомогательные функции</h2>

### <h3 id="section31">3.1 Шаблоны события логирования</h3>

При помощи метода `createTemplate` и доступных функций шаблонизации `templateFns` можно создать любой шаблон отображения
события логирования. Метод `createTemplate` принимает на вход массив функций шаблонизации и возвращает функцию создания
строки журнала логирования, принимающую на вход экземпляр класса `LogMessageInfo` (`LogMessageInfo` - класс описывающий
данные для записи в журнал логирования). Функция шаблонизации представляет собой функцию принимающую на вход также
экземпляр класса `LogMessageInfo` и возвращает строку. Если в списке заготовленных функций шаблонизации `templateFns`
нет нужной вам, то вы всегда можете создать собственную фукции по аналогии с функциями использующимися в `templateFns`.

Пример использования:

```js
import {$log, templateFns, createTemplate} from '@dlabs71/d-logger';

let template = createTemplate(
        // выводим уровень логирования
        templateFns.level(),
        // далее выводим символ разделителя "-"
        templateFns.text(' - '),
        // выводим время и дату события
        templateFns.date('DD.MM.YYYY HH:mm:ss'),
        // далее выводим символ разделителя "-"
        templateFns.text(' - '),
        // выводим файл и позицию вызова функции логирования
        templateFns.location(true),
        // переход на новую строку
        templateFns.newLine(),
        // выводим пользовательское сообщение собятия логирования
        templateFns.message(),
        // переход на новую строку
        templateFns.newLine(),
);

// Вывод в журнале логов будет следующим, при использовании данного шаблона
// 
// ERROR - 02.11.2022 09:52:53 - /app/src/main.js:141:54
// user logging message
// 

$log.configure({
    level: "debug",
    template: template
});
```

[npm-image]: https://img.shields.io/npm/v/@dlabs71/d-logger

[npm-url]: https://www.npmjs.com/package/@dlabs71/d-logger

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg

[license-url]: LICENSE
