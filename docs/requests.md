---
layout: page
title: Requests
permalink: /requests/
nav_order: 20
---

## Description

**DataUI/crud** provides a full range of path and query parameters parsing/validation to help you build rich RESTful APIs. [**@dataui/crud-request**](https://www.npmjs.com/package/@dataui/crud-request) is responsible for that.

## Table of Contents

- [Query params](#query-params)
  - [select](#select)
  - [search](#search)
  - [filter conditions](#filter-conditions)
  - [filter](#filter)
  - [or](#or)
  - [sort](#sort)
  - [join](#join)
  - [limit](#limit)
  - [offset](#offset)
  - [page](#page)
  - [cache](#cache)
- [Frontend usage](#frontend-usage)
  - [Customize](#customize)
  - [Usage](#usage)

## Query params

By default, we support these param names:

`fields`, `select` - get selected fields in GET result

`s` - search conditions (`$and`, `$or` with all possible variations)

`filter` - filter GET result by `AND` type of condition

`or` - filter GET result by `OR` type of condition

`join` - receive joined relational resources in GET result (with all or selected fields)

`sort` - sort GET result by some `field` in `ASC | DESC` order

`per_page`, `limit` - limit the amount of received resources

`offset` - offset some amount of received resources

`page` - receive a portion of limited amount of resources

`cache` - reset cache (if was enabled) and receive resources directly from the DB

**_Notice:_** You can easily map your own query params names and chose another string delimiters by applying [global options](https://github.com/dataui/crud/wiki/Controllers#global-options).

Here is the description of each of those using default params names:

### select

Selects fields that should be returned in the reponse body.

_Syntax:_

> ?fields=**field1**,**field2**,...

_Example:_

> ?fields=**email**,**name**

### search

Adds a search condition as a JSON string to you request. You can combine `$and`, `$or` and `$not` and use any [condition](#filter-conditions) you need. Make sure it's being sent encoded or just use [`RequestQueryBuilder`](#frontend-usage)

_Syntax:_

> ?s={"name": "Michael"}

_Some examples:_

- Search by field `name` that can be either `null` OR equals `Superman`

> ?s={"name": {"**\$or**": {"**\$isnull**": true, "**\$eq**": "Superman"}}}

- Search an entity where `isActive` is `true` AND `createdAt` not equal `2008-10-01T17:04:32`

> ?s={"**\$and**": [{"isActive": true}, {"createdAt": {"**$ne**": "2008-10-01T17:04:32"}}]}

...which is the same as:

> ?s={"isActive": true, "createdAt": {"**\$ne**": "2008-10-01T17:04:32"}}

- Search an entity where `isActive` is `false` OR `updatedAt` is not `null`

> ?s={"**\$or**": [{"isActive": false}, {"updatedAt": {"**$notnull**": true}}]}

- Search an entity where condition is negated

> ?s={"**\$not": [{"**\$or**": [{"isActive": false}, {"updatedAt": {"**\$notnull\*\*": true}}]}]}

So the amount of combinations is really huge.

**_Notice:_** if search query param is present, then [filter](#filter) and [or](#or) query params will be ignored.

### filter conditions

- **`$eq`** (`=`, equal)
- **`$ne`** (`!=`, not equal)
- **`$gt`** (`>`, greater than)
- **`$lt`** (`<`, lower that)
- **`$gte`** (`>=`, greater than or equal)
- **`$lte`** (`<=`, lower than or equal)
- **`$starts`** (`LIKE val%`, starts with)
- **`$ends`** (`LIKE %val`, ends with)
- **`$cont`** (`LIKE %val%`, contains)
- **`$excl`** (`NOT LIKE %val%`, not contains)
- **`$in`** (`IN`, in range, **_accepts multiple values_**)
- **`$notin`** (`NOT IN`, not in range, **_accepts multiple values_**)
- **`$isnull`** (`IS NULL`, is NULL, **_doesn't accept value_**)
- **`$notnull`** (`IS NOT NULL`, not NULL, **_doesn't accept value_**)
- **`$between`** (`BETWEEN`, between, **_accepts two values_**)
- **`$eqL`** (`LOWER(field) =`, equal)
- **`$neL`** (`LOWER(field) !=`, not equal)
- **`$startsL`** (`LIKE|ILIKE val%`)
- **`$endsL`** (`LIKE|ILIKE %val`, ends with)
- **`$contL`** (`LIKE|ILIKE %val%`, contains)
- **`$exclL`** (`NOT LIKE|ILIKE %val%`, not contains)
- **`$inL`** (`LOWER(field) IN`, in range, **_accepts multiple values_**)
- **`$notinL`** (`LOWER(field) NOT IN`, not in range, **_accepts multiple values_**)

### filter

Adds fields request condition (multiple conditions) to your request.

_Syntax:_

> ?filter=**field**||**\$condition**||**value**

> ?join[]=**relation**&filter=**relation**.**field**||**\$condition**||**value**

**_Notice:_** Using nested filter shall join relation first.

_Examples:_

> ?filter=**name**||**\$eq**||**batman**

> ?filter=**isVillain**||**\$eq**||**false**&filter=**city**||**\$eq**||**Arkham** (multiple filters are treated as a combination of `AND` type of conditions)

> ?filter=**shots**||**\$in**||**12**,**26** (some conditions accept multiple values separated by commas)

> ?filter=**power**||**\$isnull** (some conditions don't accept value)

### or

Adds `OR` conditions to the request.

_Syntax:_

> ?or=**field**||**\$condition**||**value**

It uses the same [filter conditions](#filter-conditions).

_Rules and examples:_

- If there is only **one** `or` present (without `filter`) then it will be interpreted as simple [filter](#filter):

> ?or=**name**||**\$eq**||**batman**

- If there are **multiple** `or` present (without `filter`) then it will be interpreted as a compination of `OR` conditions, as follows:
  `WHERE {or} OR {or} OR ...`

> ?or=**name**||**\$eq**||**batman**&or=**name**||**\$eq**||**joker**

- If there are **one** `or` and **one** `filter` then it will be interpreted as `OR` condition, as follows:
  `WHERE {filter} OR {or}`

> ?filter=**name**||**\$eq**||**batman**&or=**name**||**\$eq**||**joker**

- If present **both** `or` and `filter` in any amount (**one** or **miltiple** each) then both interpreted as a combitation of `AND` conditions and compared with each other by `OR` condition, as follows:
  `WHERE ({filter} AND {filter} AND ...) OR ({or} AND {or} AND ...)`

> ?filter=**type**||**\$eq**||**hero**&filter=**status**||**\$eq**||**alive**&or=**type**||**\$eq**||**villain**&or=**status**||**\$eq**||**dead**

### sort

Adds sort by field (by multiple fields) and order to query result.

_Syntax:_

> ?sort=**field**,**ASC|DESC**

_Examples:_

> ?sort=**name**,**ASC**

> ?sort=**name**,**ASC**&sort=**id**,**DESC**

### join

Receive joined relational objects in GET result (with all or selected fields). You can join as many relations as allowed in your [CrudOptions](https://github.com/dataui/crud/wiki/Controllers#join).

_Syntax:_

> ?join[]=**relation**

> ?join[]=**relation**||**field1**,**field2**,...

> ?join[]=**relation1**||**field11**,**field12**,...&join[]=**relation1**.**nested**||**field21**,**field22**,...&join[]=...

_Examples:_

> ?join[]=**profile**

> ?join[]=**profile**||**firstName**,**email**

> ?join[]=**profile**||**firstName**,**email**&join[]=**notifications**||**content**&join[]=**tasks**

> ?join[]=**relation1**&join[]=**relation1**.**nested**&join[]=**relation1**.**nested**.**deepnested**

**_Notice:_** primary field/column always persists in relational objects. To use nested relations, the parent level **MUST** be set before the child level like example above.

### New Feature: Join Condition (on clause)

The join parameter now supports specifying a WHERE condition within the ON clause of the join using the on property. This allows for more granular control over the joined data.

> ?join[]=**relation**||**field1**,**field2**,...||on[0]=**field**||**\$condition**||**value**&on[1]=**field**||**\$condition**...&join[]=...

_Examples:_

Suppose you want to retrieve `Posts` along with their associated `Author` data, but you only want to include `Authors` where the `isActive` field is `true` and the `profilePicture` field is `null` (meaning the author doesn't have a profile picture set). You can achieve this with the following query string:

> ?join[]=**author**||**fullName**,**email**||on[0]=**author.isActive**||**\$eq**||**true**&on[1]=**author.profilePicture**||**\$isnull**

This query will join the `Post` entity with its related `Author` entity, but it will only include `Author` objects where:

- The `isActive` field is set to `true`.
- The `profilePicture` field is `null`.

### limit

Receive `N` amount of entities.

_Syntax:_

> ?limit=**number**

_Example:_

> ?limit=**10**

### offset

Limit the amount of received resources

_Syntax:_

> ?offset=**number**

_Example:_

> ?offset=**10**

### page

Receive a portion of limited amount of resources.

_Syntax:_

> ?page=**number**

_Example:_

> ?page=**2**

### cache

Reset cache (if was enabled) and receive resources directly from the DB.

_Usage:_

> ?cache=0

## Frontend usage

[**@dataui/crud-request**](https://www.npmjs.com/package/@dataui/crud-request) is a framework agnostic package that has been designed for both backend and frontend usage. It's also used by [**@dataui/crud**](https://www.npmjs.com/package/@dataui/crud) package in `CrudRequestInterceptor`.

It has `RequestQueryBuilder` class that helps building a query string and customizing your query params names and delimiters.

### Customize

It has a static method `setOptions` that alows you to set different params names (defaults are shown):

```typescript
import { RequestQueryBuilder } from '@dataui/crud-request';

RequestQueryBuilder.setOptions({
  delim: '||',
  delimStr: ',',
  paramNamesMap: {
    fields: ['fields', 'select'],
    search: 's',
    filter: ['filter[]', 'filter'],
    or: ['or[]', 'or'],
    join: ['join[]', 'join'],
    sort: ['sort[]', 'sort'],
    limit: ['per_page', 'limit'],
    offset: ['offset'],
    page: ['page'],
    cache: ['cache'],
  },
});
```

### Usage

You can compose a query string in a chaining methods manner:

```typescript
import { RequestQueryBuilder, CondOperator } from "@dataui/crud-request";

const qb = RequestQueryBuilder.create();

// set search

qb.search({
  $or: [
    {
      foo: {
        $notnull: true
      },
      baz: 1
    },
    {
      bar: {
        $ne: "test"
      }
    }
  ]
});

// is actually the same as:

qb.setFilter({ field: "foo", operator: CondOperator.NOT_NULL })
  .setFilter({ field: "baz": operator: "$eq", value: 1 })
  .setOr({
    field: "bar",
    operator: CondOperator.NOT_EQUALS,
    value: "test"
  });

qb.select(['foo', 'bar'])
  .setJoin({ field: 'company' })
  .setJoin({ field: 'profile', select: ['name', 'email'] })
  .setJoin({
    field: 'boo',
    select: ['status', 'date'],
    on: [
      { field: 'bar', operator: 'eq', value: 100 },
      { field: 'baz', operator: 'isnull' },
      { field: 'date', operator: 'between', value: ['2023-01-01', '2023-12-31'] },
    ],
  })
  .sortBy({ field: 'bar', order: 'DESС' })
  .setLimit(20)
  .setPage(3)
  .resetCache()
  .query();
```

Or, you can path all params to the `create` method:

```typescript
const queryString = RequestQueryBuilder.create({
  fields: ['name', 'email'],
  search: { isActive: true },
  join: [{ field: 'company' }],
  sort: [{ field: 'id', order: 'DESC' }],
  page: 1,
  limit: 25,
  resetCache: true,
}).query();
```
