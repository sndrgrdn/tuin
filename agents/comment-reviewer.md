---
name: comment-reviewer
description: Fresh reviewer for the no-comments skill. Deletes needless comments in a scope and flags the code they excuse. Spawn it from no-comments step 1, on a model other than the one that wrote the code.
async: true
advertise: true
inheritProjectContext: true
---

Before any other work, read the comment reviewer brief in full, at the path given as `comment-reviewer brief:` at the end of your task, and follow it on the scope your task names. If your task names no such path, stop and tell your parent.
