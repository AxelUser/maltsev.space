---
date: "2022-04-20"
tags:
  - "MongoDB"
title: "Checking MongoDB Operation Status: A Simple Guide"
preview: "Learn how to easily check the status of your MongoDB operations with this step-by-step guide."
draft: false
hero: /images/blog/006-how-to-get-status-of-mongodb-operation/hero.jpg
---

When working with databases, it's not uncommon to inspect the status of a running query, whether it's for profiling purposes or as part of a polling mechanism for asynchronous operations. In this blog post, we'll explore how to use MongoDB's `$currentOp` stage to retrieve information about running queries and how to use this functionality to store the status of running operations.

## Background

My use case involves building a background service that handles data retention. The service should be able to handle multiple requests and be tolerant to failures during deletion handling. To achieve this, I need to store the states of running operations so that they can be checked during failure recovery or regular reboot/deployment.

To receive requests, I'll use a message broker like Kafka. The service will receive messages with a `JobId` and a condition specifying which data to delete. After the deletion is completed, the service will commit the message. If the service is restarted or fails, it will receive the uncommitted message again.

## Solution

A straightforward solution is to store the state in another MongoDB collection. However, storing the state may be redundant since the only need for that state is to tell if the operation was completed, and if not, whether it is running or failed.

Most of the databases I've worked with have special tables or views with information about all running queries, and MongoDB is no exception. It has a special query called [db.currentOp()](https://www.mongodb.com/docs/manual/reference/method/db.currentOp/) that returns a document with information about all running queries.

However, this API has limitations caused by MongoDB specifics. So, there's a more modern way of retrieving running queries: the [$currentOp](https://www.mongodb.com/docs/manual/reference/operator/aggregation/currentOp/) stage for the aggregation pipeline. It works like a regular stage and can be combined with other aggregation features like projection and grouping. I'll use this approach for my solution.

There are several things to keep in mind:

1. The aggregation pipeline with this stage should be run on the `admin` collection, and you need a special user to access it via your application.

2. This command returns operations that are started on a specific MongoDB node. If you're using a sharded cluster like we are, you need to run `$currentOp` on the router that started the specific delete operation. It's not a big deal, though; you can run this query against all routers in parallel and check if any have it.

3. You need to distinguish delete operations started by your service from normal operations. In our case, all data retention tasks have a `JobId`, which is a unique key for the operation. All we need is a way to mark MongoDB queries with this key.

If we look through the output format for `$currentOp`, we'll notice that it has a [comment](https://www.mongodb.com/docs/manual/reference/command/currentOp/#mongodb-data-currentOp.command) field that can be attached when a command is started. Some queries (e.g., `find`) support the [$comment](https://www.mongodb.com/docs/manual/reference/operator/query/comment/) operator, but the most universal way to pass a comment is to run a query via a [database command](https://www.mongodb.com/docs/manual/reference/command/#database-commands). With this API, we can run the delete command and pass the `JobId` into the comment field.

## Example

Now, let's look at some MongoDB shell examples.

### Starting delete operation with "JobId"

To pass `JobId` into the comment when we start the delete operation, we can use the following command:

```javascript
db.runCommand({
  delete: "Events",
  ordered: false,
  comment: "job:blog-test",
  deletes: [
    {
      q: { clientId: 0 },
      limit: 0,
    },
  ],
})
```

This MongoDB query is designed to delete all documents from the `"Events"` collection where the `"clientId"` field equals `0`. The query is executed using the `runCommand` method, which takes a single argument that is a document representing the command to be executed.

The command document contains several fields:

- `"delete"`: This field specifies the name of the collection to delete documents from, which is `"Events"` in this case.

- `"ordered"`: This field specifies whether the deletion operation should be executed in order, with each deletion waiting for the previous one to complete before starting. In this case, it is set to false, indicating that the deletion operations can be executed in parallel.

- `"comment"`: This field is an optional comment that can be included in the command. It has no effect on the operation itself, but will be highly useful in further command below.

- `"deletes"`: This field contains an array of objects, each representing a deletion operation to be executed. In this case, there is only one object, which contains two fields:

  - `"q"`: This field specifies the query that will be used to match documents to be deleted. In this case, the query is searching for documents where the `"clientId"` field equals 0.

  - `"limit"`: This field specifies the maximum number of documents to delete. In this case, it is set to 0, indicating that all documents matching the query should be deleted.

When executed, this query will delete all documents from the `"Events"` collection where the `"clientId"` field equals `0`. The deletion will be executed in parallel and there is no limit to the number of documents that can be deleted. The optional comment included in the command document is "job:blog-test", which is our `JobId`.

### Finding running operation by "JobId"

MongoDB query below uses the aggregate method to find a specific operation that has a JobId in its command.comment field:

```javascript
db.aggregate([
  { $currentOp: { localOps: true } },
  { $match: { "command.comment": "job:blog-test" } },
  { $limit: 1 },
])
```

The first stage of the pipeline is `$currentOp`, which returns information about the current operations running on the server. The `localOps` option is set to `true`, which limits the output to only show operations running on the same node as the query.

The second stage is `$match`, which filters the running operations based on a specific condition. In this case, it matches operations that have a comment field in their command object that matches the value "job:blog-test".

The third stage is `$limit`, which limits the output to the first document that matches the filter. Since we are looking for a single operation, we must set the limit to `1`.

In summary, this query finds the first operation running on the current node that has a `JobId` in its command.comment field equal to `"job:blog-test"`.

If an operation with such a comment is running on the current node (or router), we'll receive a single document, containing all the info about operation with specified `JobId`:

```json
{
    "type" : "op",
    "host" : "f0fde895fb50:27017",
    "desc" : "conn65",
    "connectionId" : 65,
    "client" : "172.18.0.1:57176",
    "appName" : "MongoDB Shell",
    "clientMetadata" : {
        "application" : {
            "name" : "MongoDB Shell"
        },
        "driver" : {
            "name" : "MongoDB Internal Client",
            "version" : "4.2.6-18-g6cdb6ab"
        },
        "os" : {
            "type" : "Windows",
            "name" : "Microsoft Windows 8",
            "architecture" : "x86_64",
            "version" : "6.2 (build 9200)"
        },
        "mongos" : {
            "host" : "f0fde895fb50:27017",
            "client" : "172.18.0.1:57176",
            "version" : "4.4.11"
        }
    },
    "active" : true,
    "currentOpTime" : "2022-04-19T22:01:50.629+00:00",
    "opid" : 996,
    "lsid" : {
        "id" : UUID("e42b457e-bc01-4ffa-83dc-343f1f6ea351"),
        "uid" : { "$binary" : "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=", "$type" : "00" }
    },
    "secs_running" : NumberLong(3),
    "microsecs_running" : NumberLong(3406911),
    "op" : "remove",
    "ns" : "testdb.Events",
    "command" : {
        "delete" : "Events",
        "ordered" : false,
        "comment" : "job:blog-test",
        "lsid" : {
            "id" : UUID("e42b457e-bc01-4ffa-83dc-343f1f6ea351")
        },
        "$clusterTime" : {
            "clusterTime" : Timestamp(1650405661, 34),
            "signature" : {
                "hash" : { "$binary" : "AAAAAAAAAAAAAAAAAAAAAAAAAAA=", "$type" : "00" },
                "keyId" : NumberLong(0)
            }
        },
        "$readPreference" : {
            "mode" : "secondaryPreferred"
        },
        "$db" : "testdb"
    },
    "numYields" : 0,
    "waitingForLatch" : {
        "timestamp" : ISODate("2022-04-19T22:01:47.323Z"),
        "captureName" : "ProducerConsumerQueue::_mutex"
    }
}
```
