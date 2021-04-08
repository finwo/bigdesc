# BigDesc

Big discrete integer library

## Introduction

There are plenty of big number implementations, even a node-native one these
days. What I found missing was a library to handle discrete integers and logic,
basically having a large fixed-with integer implementation.

## Installation

```sh
npm install --save bigdesc
```

```js
const BigDesc = require('bigdesc');
```

## Usage

### new BigDesc(bits, value = 0, format = 'auto')

Initializes a new bigdesc entity, optionally with a numerical value.

### bigdesc.toString(format = 'hex')

Formats the value of the bigdesc instance to a string with the given format.

### bigdesc.inv()

Returns a new bigdesc instance with all bits in it's value inverted.

### bigdesc.add(value)

Returns a new bigdesc instance with the given value added to the original value.

### bigdesc.sub(value)

Returns a new bigdesc instance with the given value subtracted from the original value.

### bigdesc.isZero()

Returns a boolean true if the value held equals zero.
If not, this method returns a boolean false.

### bigdesc.isNegative()

Returns a boolean true if the value held is negative.
If not, this method returns a boolean false.

### bigdesc.isPositive()

Returns a boolean true if the value held is positive.
If not, this method returns a boolean false.

### bigdesc.gt(value)

Returns a boolean true if the value held is larger than the given value.
If not, this method returns a boolean false.

### bigdesc.lt(value)

Returns a boolean true if the value held is smaller than the given value.
If not, this method returns a boolean false.

### bigdesc.eq(value)

Returns a booelan true if the value held matches the given value.
If not, this method returns a boolean false.

### bigdesc.gte(value)

Returns a boolean true if the value held is larger or equal to the given value.
If not, this method returns a boolean false.

### bigdesc.lte(value)

Returns a boolean true if the value held is smaller or equal to the given value.
If not, this method returns a boolean false.
