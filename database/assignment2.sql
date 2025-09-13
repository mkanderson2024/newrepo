-- Creates Tony Stark account
INSERT INTO account (
        account_id,
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        1,
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronm@n'
    );
-- Modifies Tony Stark record for admin account type
UPDATE account
SET account_type = 'admin'
WHERE account_id = 1;
-- Delete Tony Stark record from the database
DELETE FROM account
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
-- Modify the GM Hummer record to read a huge interior rather than small interiors using REPLACE
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    );
;
-- Select vehicles make and model with classification "Sport"
SELECT inv_make,
    inv_model
FROM inventory i
    INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- Updating invenotry table image file path to include /vehicles
UPDATE inventory
SET inv_image = REPLACE(
        inv_image,
        'images/',
        'images/vehicles/'
    ),
    inv_thumbnail = REPLACE(
        inv_thumbnail,
        'images',
        'images/vehicles/'
    );
;