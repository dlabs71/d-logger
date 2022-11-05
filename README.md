# d-logger

Библиотека для ведения журнала логирования JS/Vue приложений.

[![NPM Version][npm-image]][npm-url]
[![License][license-image]][license-url]

# Установка NPM

```sh
npm i d-logger
```

# Использование

Данная библиотека может быть использована в любом js приложении, вне зависимости от фреймворка. Также она предоставляет
поддержку подключения к Vue.js приложению через плагин.

## Подключение к Vue.js приложению

Для использования d-logger во Vue приложении, импортируйте **`DLoggerPlugin`** плагин и подключите его.

**`main.js`**

```js
import DLoggerPlugin from 'd-logger';

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
| template     | function  | null                      | Функция определяющая шаблон строки логирования ([шаблоны](#3.1-Шаблоны-события-логирования)) | 
| appenders    | array     | []                        | Список апендеров, реализующих класс **`LogAppender`**. По умолчанию сразу доступен **`ConsoleAppender`** ([аппендеры](#2.-Логгер))|

Далее вы можете использовать её через **`this.$log`** как в примере ниже:

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

Для использования логгера без плагина Vue.js достаточно импортировать **`$log`** из **`d-logger`**. Вы получаете,
настроенный по умолчанию, экземпляр класса DLogger. Он будет использовать **`ConsoleAppender`** в качестве единственного
и основного аппендера логирования ([Логгер](#2.-Логгер)).

```js
import {$log} from 'd-logger';

function exampleFunc(param1, param2) {
    $log.info("Start exampleFunc with parameters: param1 = ", param1, ", param2 = ", param2);
}
```

Логгер можно перенастроить, для этого есть метод **`configure`**. Про его использование читайте в
документации [Метод configure](#2.2.1-Метод-configure).

```js
import {$log} from 'd-logger';

$log.configure({
    level: "error"
});

function exampleFunc(param1, param2) {
    $log.info("Start exampleFunc with parameters: param1 = ", param1, ", param2 = ", param2);
}
```

# Документация

## 1. Уровни логирования

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

## 2. Логгер

Логгер представляет собой экземпляр класса **`DLogger`**. Для управления журналом логирования существуют специальные
классы, наследующие класс **`LogAppender`** (далее аппендеры). Из коробки доступно 2 реализации:

* **`ConsoleAppender`** - аппендер делегирующий управление журналов логирования реализации **`console`**
* **`FileAppender`** - аппендер использующий файлы для записи событий логирования

### 2.1 Методы логирования

Логгер предоставляет методы соответствующие каждому из уровней логирования. Параметрами является массив значений любого
типа.

**`example.js`**

```js
import {$log} from 'd-logger';

function exampleFunc(param1, param2) {
    $log.info("Start exampleFunc with parameters: param1 = ", param1, ", param2 = ", param2);
}
```

Если параметром метода логирования будет являться функция, то при вызове метода она выполниться, а результат будет
конвертирован в строку. Когда параметр является объектом или массивом то значение будет преобразовано в строку при
помощи **`JSON.stringify`**.

### 2.2 Методы конфигурации и управления аппендерами

#### 2.2.1 Метод configure

Логгер предоставляет метод конфигурации **`configure`**. Данный метод принимает объект с параметрами конфигурации,
описанные в таблице ниже.

| **Параметр** | **Тип**   | **Значение по умолчанию** | **Описание**
| :------------| :---------| :-------------------------| :-------------------------------------
| level        | string    | debug                     | устанавливает уровень логирования
| template     | function  | null                      | Функция определяющая шаблон строки логирования сразу для всех аппендеров ([шаблоны](#3.1-Шаблоны-события-логирования)).
| appenders    | array     | []                        | Список аппендеров реализующих класс **`LogAppender`**. По умолчанию сразу устанавливается **`ConsoleAppender`**

Пример использования:

```js
import {$log} from 'd-logger';

$log.configure({
    level: "error"
});
```

#### 2.2.2 Метод clearAppenders

Метод предназначен для очищения списка аппендеров.

Пример использования:

```js
import {$log} from 'd-logger';

$log.clearAppenders();
```

#### 2.2.3 Метод addFileAppender

Метод для добавления **`FileAppender`**. Параметры функции описаны в таблице ниже

| **Параметр**    | **Тип**  | **Значение по умолчанию** | **Описание**
| :---------------| :--------| :-------------------------| :-------------------------------------
| pathToDir       | string   |                           | **Обязательное для
заполнения.** Путь до директории лог файлов.
| isRotatingFiles | boolean  | false                     | Активация механизма ротации файлов (удаление старых файлов)
| filePrefix      | string   | null                      | Префикс для файлов логирования
| level           | string   | null                      | Устанавливает уровень логирования аппендера
| template        | function | null                      | Функция определяющая шаблон строки логирования аппендера ([шаблоны](#3.1-Шаблоны-события-логирования)).
| stepInStack     | number   | 5                         | Номер строки в стеке вызовов ошибки для определения файла и позиции вызова метода логирования. Если библиотека показывает не верный файл вызова метода логирования, то необходимо поменять данный параметр.

Пример использования:

```js
import {$log} from 'd-logger';

$log.addFileAppender('/var/log/app', true);
```

#### 2.2.4 Метод getFileAppenders

Метод для получения списка всех **`FileAppender-ов`**.

```js
import {$log} from 'd-logger';

$log.addFileAppender('/var/log/app', true);
let fileAppenders = $log.getFileAppenders();
// fileAppenders = [FileAppender] 
```

#### 2.2.5 Метод existFileAppender

Метод для проверки существования **`FileAppender-ов`** в списке аппендеров

```js
import {$log} from 'd-logger';

$log.addFileAppender('/var/log/app', true);
let exist = $log.existFileAppender();
// exist = true
```

#### 2.2.6 Метод deleteAllFileLogs

Метод для удаления всех лог файлов

```js
import {$log} from 'd-logger';

$log.addFileAppender('/var/log/app', true);
$log.deleteAllFileLogs();
```

#### 2.2.7 Метод addConsoleAppender

Метод для добавления **`ConsoleAppender`**. Параметры функции описаны в таблице ниже

| **Параметр** | **Тип**  | **Значение по умолчанию** | **Описание**
| :------------| :--------| :-------------------------| :-------------------------------------
| level        | string   | null                      | Устанавливает уровень логирования аппендера
| colorize     | boolean  | true                      | Использовать цвет логирования
| template     | function | null                      | Функция определяющая шаблон строки логирования аппендера ([шаблоны](#3.1-Шаблоны-события-логирования)).
| stepInStack  | number   | 5                         | Номер строки в стеке вызовов ошибки для определения файла и позиции вызова метода логирования. Если библиотека показывает не верный файл вызова метода логирования, то необходимо поменять данный параметр.

Пример использования:

```js
import {$log} from 'd-logger';

$log.addConsoleAppender("debug", true);
```

#### 2.2.8 Метод addCustomAppender

Метод для добавления собственной реализации аппендера. Он должен наследовать **`LogAppender`** класс.

Пример использования:

```js
import {$log, LogAppender} from 'd-logger';

class CustomAppender extends LogAppender {

    constructor() {
        super({});
    }

    log(strings, level = null, stepInStack = null) {
        const message = this.creatingMessage(strings, level, stepInStack);
        // реализация данного метода
        return message
    }
}

$log.addCustomAppender(new CustomAppender());
```

### 2.3 Вспомогательные методы логгера

#### 2.3.1 Метод logProcessEnvs

Метод для печати в журнал логов всех переменных окружения (**`process.env`**)

Пример использования:

```js
import {$log} from 'd-logger';

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

#### 2.3.2 Метод dprsValue

Метод для обезличивания строки

Пример использования:

```js
import {$log} from 'd-logger';

$log.dprsValue("qwerty$4", "password");
// return "password:8"

$log.dprsValue(null, "password");
// return "password:null"

$log.dprsValue(undefined, "password");
// return "password:undefined"
```

#### 2.3.3 Метод dprsObj

Метод для обезличивания полей в объекте

Пример использования:

```js
import {$log} from 'd-logger';

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

#### 2.3.4 Метод len

Метод для получения длины строки. Если параметр null или undefined, то возвращает соответствующее значение

Пример использования:

```js
import {$log} from 'd-logger';

$log.len("qwerty$4");
// return 8

$log.len(null);
// return null

$log.len(undefined);
// return undefined
```

## 3. Вспомогательные функции

### 3.1 Шаблоны события логирования

При помощи метода **`createTemplate`** и доступных функций шаблонизации **`templateFns`** можно создать любой шаблон
отображения события логирования. Метод **`createTemplate`** принимает на вход массив функций шаблонизации и возвращает
функцию создания строки журнала логирования, принимающую на вход экземпляр
класса **`LogMessageInfo`** (**`LogMessageInfo`** - класс описывающий данные для записи в журнал логирования). Функция
шаблонизации представляет собой функцию принимающую на вход также экземпляр класса **`LogMessageInfo`** и возвращает
строку. Если в списке заготовленных функций шаблонизации **`templateFns`** нет нужной вам, то вы всегда можете создать
собственную фукции по аналогии с функциями использующимися в **`templateFns`**.

Пример использования:

```js
import {$log, templateFns, createTemplate} from 'd-logger';

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

[npm-image]: https://img.shields.io/npm/v/vue-logger-plugin.svg

[npm-url]: v1.0.0

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg

[license-url]: LICENSE
