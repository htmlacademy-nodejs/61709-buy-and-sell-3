/* Get all categories */
SELECT
	categories.id AS "Идентификатор",
	categories.title AS "Наименование категории"
FROM categories

/* Get category including at least one offer */
SELECT
	categories.id AS "Идентификатор",
	categories.title AS "Наименование категории"
FROM offers_categories
INNER JOIN categories
	ON offers_categories.category_id = categories.id
GROUP BY categories.id
HAVING count(categories.id) > 0
ORDER BY categories.id ASC

/* Get all categories with offer quantity */
SELECT
	categories.id AS "Идентификатор",
	categories.title AS "Наименование категории",
	count(offers_categories.category_id) AS "Количество объявлений в категории"
FROM offers_categories
LEFT JOIN categories
	ON offers_categories.category_id = categories.id
GROUP BY
	categories.id,
	categories.title
ORDER BY
	COUNT(offers_categories.category_id) DESC;

/* Get all offers with users, comments, categories data ordered by novelty */
SELECT
	offers.id AS "Идентификатор",
	offers.title AS "Наименование категории",
	offers.sum AS "Стоимость",
	offers.type AS "Тип",
	offers.description AS "Текст объявления",
	offers.date AS "Дата публикации",
	concat(users.firstname, ' ', users.lastname) AS "Имя и фамилия автора",
	users.email AS "Контактный email",
	count(comments.offer_id) AS "Количество комментариев",
	(
		SELECT
			string_agg(categories.title, ', ') AS "Наименование категорий"
		FROM offers_categories
		LEFT JOIN categories
			ON offers_categories.category_id = categories.id
			AND offers_categories.offer_id = offers.id
	)
FROM offers
INNER JOIN users
	ON users.id = offers.user_id
INNER JOIN comments
	ON comments.offer_id = offers.id
GROUP BY
	offers.id,
	users.firstname,
	users.lastname,
	users.email
ORDER BY
	offers.date DESC;

/* Get one offer with users, comments, categories data*/
SELECT
	offers.id AS "Идентификатор",
	offers.title AS "Наименование категории",
	offers.sum AS "Стоимость",
	offers.type AS "Тип",
	offers.description AS "Текст объявления",
	offers.date AS "Дата публикации",
	concat(users.firstname, ' ', users.lastname) AS "Имя и фамилия",
	users.email AS "Контактный email",
	count(comments.offer_id) AS "Количество комментариев",
	(
		SELECT
			string_agg(categories.title, ', ') AS "Наименование категорий"
		FROM offers_categories
		LEFT JOIN categories
			ON offers_categories.category_id = categories.id
			AND offers_categories.offer_id = offers.id
	)
FROM offers
INNER JOIN users
	ON users.id = offers.user_id
INNER JOIN comments
	ON comments.offer_id = offers.id
WHERE offers.id = 1
GROUP BY
	offers.id,
	users.firstname,
	users.lastname,
	users.email
ORDER BY
	offers.date DESC;

/* Get 5 newest comments with user data */
SELECT
	comments.id AS "Идентификатор комментария",
	comments.offer_id AS "Идентификатор объявления",
	concat(users.firstname, ' ', users.lastname) AS "Имя и фамилия автора",
	comments.text AS "Tекст комментария"
FROM comments
	INNER JOIN users
		ON comments.user_id = users.id
ORDER BY comments.date DESC
LIMIT 5

/* Get offer comments with user data ordered by novelty*/
SELECT
	comments.id AS "Идентификатор комментария",
	comments.offer_id AS "Идентификатор объявления",
	concat(users.firstname, ' ', users.lastname) AS "Имя и фамилия автора",
	comments.text AS "Tекст комментария"
FROM comments
	INNER JOIN users
		ON comments.user_id = users.id
WHERE comments.offer_id = 1
ORDER BY
  comments.date DESC;

/* Get 2 offers with type 'buy' */
SELECT
	*
FROM offers
WHERE offers.type = 'buy'
LIMIT 2

/* Update offer title */
UPDATE offers
SET title = 'Уникальное предложение!'
WHERE offers.id = 1
