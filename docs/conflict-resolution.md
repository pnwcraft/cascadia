# Pull request conflict resolution

## Current local status

The local working tree has no unresolved Git merge state and no conflict markers in source files. Run this check any time before pushing:

```bash
npm run check:conflicts
```

The check verifies both:

- `git ls-files -u` has no unmerged index entries.
- Source files do not contain conflict marker lines such as `<<<<<<<`, `=======`, or `>>>>>>>`.

## Why GitHub can still show conflicts

GitHub can report "This branch has conflicts" even when the local working tree is clean if the pull request branch was created from an older base and the target branch now contains changes to the same files. That is a remote branch-history conflict, not an in-file conflict marker problem.

The fix is to update the PR branch with the target branch, resolve each listed file once, then push the resolution commit:

```bash
git fetch origin
git checkout <your-pr-branch>
git merge origin/main
# or: git rebase origin/main
# resolve listed files, then run:
npm run check
npm run build
git add .
git commit
git push
```

For this project, keep the premium redesigned versions of the listed HTML/CSS/build files when resolving conflicts, then rerun the checks above.
