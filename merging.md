I need to merge two branches and resolve conflicts. The branches in question are: `profile-manager-fixing` and `Trieu_Frontend`. I am currently on the `profile-manager-fixing` branch and want to merge `Trieu_Frontend` into it.

There is a backup branch named `profile-manager-fixing-backup` already.

I need the new UI and Frontend components from `Trieu_Frontend`, while making sure that the new features: profile management and favorite list from `profile-manager-fixing` work properly with the new UI.

`Trieu_Frontend` has a new and updated some of the UI elements.

`profile-manager-fixing` has old UI components, but has new working backend and database features for profile management and a favorite list, which I want to integrate with the new UI from `Trieu_Frontend`.

Preserve the database credentials of `profile-manager-fixing` branch. The new branch has different database credentials, and I want to keep the ones from `profile-manager-fixing` for convenience. The details are as follows:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=Bumba_fresh
DB_USER=postgres
DB_PASSWORD=12345


The branch `Trieu_Frontend` has a new database schema, with RBAC accounts for testing new features. The branch `profile-manager-fixing` has a the old database schema, with a new relation for `favorite` to keep track of favorite meals of each user, which I want to keep.

Resolve the conflicts by merging the branches while ensuring that the new UI from `Trieu_Frontend` works with the backend features from `profile-manager-fixing`. 

DO NOT delete any files, but update the necessary files to ensure compatibility. 
DO NOT overwrite the database credentials from `profile-manager-fixing`. 
DO NOT create new files, but modify existing ones to integrate the new UI with the backend features.
DO NOT create readme files or documentation, just focus on the code changes needed to merge the branches.


