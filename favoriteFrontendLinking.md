Now that the favorite functionality is working, I would like to link this to the frontend meal cards. Each card has a heart to mark favorite. 

The user can click the heart marked the meal as favorite, which will add that to the `favorite` relations in the database. Click the heart again, and the user will remove that from favorite. 

There is no need to create a new tab for browsing favorite meals. However, the state of the heart icon must stay consistent. After a user logins, the server will query the `favorite` relations to retrieve the favorite meals of the user; and the heart must stay red if the user has previously marked favorite on that meal. 