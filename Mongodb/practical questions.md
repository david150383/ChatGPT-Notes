Absolutely. Below is a complete MongoDB practice curriculum for the exact dataset generated above.

It contains 200 questions, progressing from basic CRUD to 8-year/senior-level MongoDB, including aggregation, $lookup, arrays, indexes, explain(), schema design, transactions, replication, sharding, and production troubleshooting.

I recommend not looking for solutions initially. Solve each in mongosh.

MongoDB Complete Practice Set — 200 Questions
Dataset
ecommerce
├── users       10,000
├── products     2,000
├── orders      50,000
├── reviews     20,000
└── payments    50,000

LEVEL 1 — MongoDB Shell & CRUD
Questions 1–20
Database / Collections

1. Switch to the ecommerce database.

2. Display all collections.

3. Display the number of documents in every collection.

4. Display one document from each collection.

5. Display the indexes currently created on every collection.

Basic Find

6. Find all users.

7. Find the first user.

8. Find all active users.

9. Find all inactive users.

10. Find all blocked users.

11. Find users older than 40.

12. Find users younger than 25.

13. Find users between ages 25 and 40.

14. Find all users from Hyderabad.

15. Find all users from India.

16. Find all users from the USA.

17. Find all Electronics products.

18. Find all products manufactured by Apple.

19. Find products costing more than ₹100,000.

20. Find products with stock equal to zero.

LEVEL 2 — Projection, Sorting, Pagination
Questions 21–35

21. Return only:

name
email


from users.

22. Return:

name
city
country


without _id.

23. Find the 10 oldest users.

24. Find the 10 youngest users.

25. Find the 20 most expensive products.

26. Find the 20 cheapest products.

27. Sort products by price ascending.

28. Sort products by price descending.

29. Find products between ₹10,000 and ₹50,000.

30. Implement pagination:

page = 3
pageSize = 20


31. Find the second page of products.

32. Find users ordered by createdAt.

33. Find the 10 most recently registered users.

34. Find the 10 oldest products.

35. Return only product:

name
price
brand
rating

LEVEL 3 — Query Operators
Questions 36–55

36. Find users whose age is greater than 30.

37. Find users whose age is greater than or equal to 30.

38. Find users whose age is less than 30.

39. Find users whose age is less than or equal to 30.

40. Find users from:

Hyderabad
Bengaluru
Mumbai


using $in.

41. Find users NOT from those cities using $nin.

42. Find products belonging to:

Electronics
Audio
Footwear


43. Find products whose price is NOT between ₹10,000 and ₹50,000.

44. Find users whose status is either active or inactive.

45. Find users who are not blocked.

46. Find products where stock is greater than 100 AND rating is greater than 4.

47. Find products where:

price > 100000
OR
rating > 4.8


48. Find users whose email contains "gmail".

49. Find users whose name starts with "A".

50. Find users whose name ends with "Sharma".

51. Find products where phone does not exist.

52. Find users where phone exists.

53. Find products where reviewCount exists.

54. Find products where reviewCount does not exist.

55. Find documents containing explicit null values.

LEVEL 4 — Arrays
Questions 56–75

The dataset contains arrays such as:

roles
tags
preferences.categories
items


56. Find all premium users.

57. Find users whose roles contains "premium".

58. Find users whose roles contains "customer".

59. Find products containing "laptop" in tags.

60. Find products containing "gaming".

61. Find products containing "wireless".

62. Find products containing both:

computer
premium


63. Find products containing either:

mobile
laptop


64. Find products having an empty tags array.

65. Find users whose preferred categories contain "Electronics".

66. Find users who have more than 2 preferred categories.

67. Find users who have exactly one role.

68. Find orders containing more than 2 items.

69. Find orders containing exactly 1 item.

70. Find orders where at least one item has quantity >= 3.

71. Find orders containing a product with price greater than ₹100,000.

72. Explain why $elemMatch can be important when querying arrays of objects.

73. Use $elemMatch to find orders containing an item where:

quantity >= 2
AND
price > 50,000


74. Find products having at least 4 tags.

75. Find the maximum number of items in any order.

LEVEL 5 — Updates
Questions 76–95

76. Update one user's status to inactive.

77. Update all blocked users to inactive.

78. Increase the price of one product by 10%.

79. Increase all Electronics product prices by 5%.

80. Decrease all products with stock > 100 by 3%.

81. Add "featured" to a product's tags.

82. Remove "sale" from product tags.

83. Add "premium" role to a user.

84. Remove "premium" from a user.

85. Update a nested address field.

86. Update a user's city.

87. Set a default phone number for users where it doesn't exist.

88. Remove a field from documents.

89. Use $inc to increase stock by 50.

90. Use $mul to increase product prices by 10%.

91. Use $min to prevent a price from exceeding a certain value.

92. Use $max to increase a minimum price.

93. Add a new preference to a user.

94. Update multiple documents using updateMany().

95. Explain the difference between $set, $unset, $inc, $mul, $push, $addToSet, $pull, and $pop.

LEVEL 6 — Delete & Data Cleanup
Questions 96–105

96. Delete one blocked user.

97. Delete all blocked users.

98. Delete products with zero stock.

99. Delete reviews with rating 1.

100. Delete failed payments older than a specified date.

101. Find duplicate emails.

102. Find duplicate SKUs.

103. Find duplicate transaction IDs.

104. Find users with missing email.

105. Find products with missing reviewCount.

LEVEL 7 — Aggregation Fundamentals
Questions 106–130

106. Count total users using aggregation.

107. Count active users.

108. Count users by status.

109. Count users by country.

110. Count users by city.

111. Find average user age.

112. Find minimum user age.

113. Find maximum user age.

114. Calculate average product price.

115. Find minimum product price.

116. Find maximum product price.

117. Count products by category.

118. Count products by brand.

119. Find average price by category.

120. Find average rating by category.

121. Find maximum price in each category.

122. Find minimum price in each category.

123. Find categories having more than 100 products.

124. Find brands having more than 50 products.

125. Count orders by status.

126. Count orders by payment status.

127. Find average order amount.

128. Find maximum order amount.

129. Find minimum order amount.

130. Find total revenue.

LEVEL 8 — Revenue & Business Analytics
Questions 131–150

131. Find revenue by order status.

132. Find revenue from delivered orders only.

133. Find revenue from cancelled orders.

134. Find revenue by year.

135. Find revenue by month.

136. Find monthly order count.

137. Find yearly order count.

138. Find the month with the highest revenue.

139. Find the year with the highest revenue.

140. Find the average order value per month.

141. Find total discount given.

142. Find total tax collected.

143. Find total shipping fees collected.

144. Find revenue by city.

145. Find revenue by country.

146. Find revenue by shipping method.

147. Find revenue by payment status.

148. Find the top 10 highest-value orders.

149. Find customers who spent more than ₹1,000,000.

150. Find customers who placed more than 20 orders.

LEVEL 9 — $unwind
Questions 151–165

151. Unwind orders.items.

152. Count total product items sold.

153. Calculate total quantity sold for every product.

154. Find the top 20 products by quantity sold.

155. Find total revenue per product.

156. Find total revenue per product category.

157. Find average selling price per product.

158. Find the most frequently ordered product.

159. Find the product with the highest revenue.

160. Find the product with the lowest revenue among products that were actually sold.

161. Find the top 10 categories by revenue.

162. Find how many unique products each customer purchased.

163. Find customers who purchased more than 10 unique products.

164. Find the average number of products per order.

165. Find the maximum number of products in a single order.

LEVEL 10 — $lookup
Questions 166–180

166. Join orders with users.

167. Return:

orderNumber
customer name
email
totalAmount


168. Find orders placed by users from Hyderabad.

169. Find orders placed by premium users.

170. Find total spending per customer including customer name and email.

171. Find the top 10 customers by spending with their names.

172. Find customers who have never placed an order.

173. Join products with reviews.

174. Calculate average review rating for every product.

175. Find products with average rating above 4.5.

176. Find products with no reviews.

177. Find the number of reviews per product.

178. Find users who have written more than 5 reviews.

179. Join payments with orders.

180. Join:

payments
→ orders
→ users


and produce a complete payment report.

LEVEL 11 — Advanced Aggregation
Questions 181–200

181. Use $facet to return in one query:

total products
average price
minimum price
maximum price
average rating


182. Use $facet to create a product dashboard containing:

products by category
products by brand
price statistics
rating statistics


183. Use $bucket to group products into:

0–10,000
10,000–50,000
50,000–100,000
100,000+


184. Use $bucket to group users by age:

18–25
26–35
36–45
46–60
60+


185. Find the top 3 products in every category.

186. Find the top 3 customers in every country.

187. Find the highest revenue month for every year.

188. Find the highest-spending customer for every country.

189. Find each customer's first order.

190. Find each customer's latest order.

191. Calculate the number of days between a customer's first and latest order.

192. Find customers whose latest order was within the last 30 days.

193. Find products whose rating is higher than the average rating of their category.

194. Find orders whose amount is higher than the average order amount.

195. Find customers whose spending is higher than the average customer spending.

196. Find the percentage of orders that were cancelled.

197. Find the percentage of payments that succeeded.

198. Calculate monthly revenue growth.

199. Calculate each customer's running total spending.

200. Use $setWindowFields to rank products by revenue within each category.

LEVEL 12 — Advanced Business Problems

These are particularly useful for experienced candidates.

Questions 201–220

201. Find customers who bought products from at least 3 different categories.

202. Find customers who purchased both Electronics and Footwear.

203. Find customers who purchased the same product more than 3 times across different orders.

204. Find products frequently purchased together.

Example:

iPhone + AirPods
Laptop + Mouse
Laptop + Keyboard


205. Find the top 10 product pairs purchased together.

206. Find customers who haven't ordered anything in the last 12 months.

207. Find customers whose order frequency is increasing.

208. Find customers whose average order value is greater than ₹50,000.

209. Find customers with more than 5 cancelled orders.

210. Find customers with a cancellation rate above 20%.

211. Find products with high stock but low sales.

212. Find products with low stock and high sales.

213. Find products that have high ratings but low sales.

214. Find products that have high sales but poor ratings.

215. Find products with many reviews but rating below 3.

216. Find users who have purchased a product but never reviewed it.

217. Find verified reviewers who purchased the product.

218. Find the percentage of reviews that are from verified purchases.

219. Find the average review rating by country.

220. Find the average review rating by product category.

LEVEL 13 — Date & Time Practice
Questions 221–240

221. Find orders from 2024.

222. Find orders from 2025.

223. Find orders from the current year.

224. Find orders from the last 30 days.

225. Find orders from the last 90 days.

226. Group orders by year.

227. Group orders by month.

228. Group orders by day of week.

229. Find the busiest day of the week.

230. Find the busiest month.

231. Find revenue by quarter.

232. Find the first order date for each customer.

233. Find the latest order date for each customer.

234. Calculate customer lifetime.

235. Calculate average days between orders per customer.

236. Find customers who ordered at least once every year.

237. Find customers who haven't ordered in 2 years.

238. Find products added in the last year.

239. Find reviews created within 7 days of an order.

240. Find payments made more than 24 hours after an order.

LEVEL 14 — Indexing
Questions 241–260

241. Create an index on:

users.email


242. Create an index on:

users.status


243. Create an index on:

products.category


244. Create an index on:

products.price


245. Create a compound index:

category + price


246. Create an index on:

orders.userId


247. Create an index on:

orders.orderDate


248. Create a compound index for:

userId + orderDate


249. Determine which index would optimize:

db.orders.find({
    userId: someUserId,
    status: "delivered"
}).sort({
    orderDate: -1
})


250. Explain the ESR rule.

251. What index would you create for:

{
    category: "Electronics",
    price: { $gt: 50000 }
}


252. What index would you create for:

{
    userId: X
}
.sort({
    orderDate: -1
})


253. Test whether MongoDB uses your index.

254. Find unused indexes.

255. Determine the number of indexes on each collection.

256. Explain the cost of maintaining many indexes.

257. Create a unique index on sku.

258. Create a unique index on email.

259. What happens if duplicate values already exist when creating a unique index?

260. Explain multikey indexes using the tags field.

LEVEL 15 — explain() and Performance
Questions 261–280

261. Run:

db.users.find({
    email: "..."
}).explain("executionStats")


Analyze it.

262. Run explain() before and after creating an index.

263. Compare:

COLLSCAN


vs

IXSCAN


264. Explain totalDocsExamined.

265. Explain totalKeysExamined.

266. Explain nReturned.

267. Explain executionTimeMillis.

268. Find a query that performs a collection scan.

269. Optimize that query.

270. Find a query examining many documents but returning very few.

271. Find a query where the index is poorly selective.

272. Compare a single-field index with a compound index.

273. Test whether a query is covered by an index.

274. Use projection to create a covered query.

275. Investigate a slow $lookup.

276. Investigate a slow $sort.

277. Investigate a slow $group.

278. Determine whether sorting is happening in memory or requires disk.

279. Explain why an index may improve filtering but not necessarily improve the entire aggregation.

280. Design an indexing strategy for a collection containing 500 million orders.

LEVEL 16 — Schema Design
Questions 281–300

281. Explain embedding vs referencing.

282. Should user addresses be embedded or referenced?

283. Should order items be embedded or referenced?

284. Why should historical product price be stored inside an order item?

285. Why shouldn't an order depend entirely on the current product price?

286. How would you model product reviews?

287. How would you prevent an order document from becoming too large?

288. What is an unbounded array?

289. Why can unbounded arrays become a problem?

290. Design a social-media post schema.

291. Design a chat application schema.

292. Design a food-delivery application schema.

293. Design a banking transaction schema.

294. Design a ticket-booking schema.

295. Design a product catalog supporting multiple variants.

296. Design a shopping cart schema.

297. Design an inventory system.

298. Design a notification system.

299. Design an audit-log collection.

300. Explain how your schema would change if the application grew from 1 million to 1 billion documents.

LEVEL 17 — Update Patterns & Atomicity
Questions 301–315

301. Explain MongoDB's single-document atomicity.

302. Atomically decrement product stock when an order is placed.

303. Prevent stock from becoming negative.

304. Increment a product's sales counter after an order.

305. Maintain a user's order count.

306. Maintain product review count.

307. Maintain average product rating.

308. Explain race conditions in stock updates.

309. Explain optimistic concurrency.

310. Use a version field to prevent lost updates.

311. Explain $currentDate.

312. Explain findOneAndUpdate().

313. Return the updated document after an update.

314. Explain upsert.

315. Create a document using upsert: true.

LEVEL 18 — Transactions
Questions 316–330

316. What is a MongoDB transaction?

317. Why might an e-commerce order require a transaction?

318. Create a transaction that:

create order
decrease stock
create payment


319. What happens if one transaction operation fails?

320. Explain commitTransaction().

321. Explain abortTransaction().

322. Explain transaction isolation.

323. Explain transaction duration limitations.

324. When should you avoid transactions?

325. Can MongoDB transactions span multiple collections?

326. Can MongoDB transactions span multiple databases?

327. Explain retryable transactions.

328. Explain transaction performance implications.

329. Explain read concern in transactions.

330. Explain write concern in transactions.

LEVEL 19 — Replication
Questions 331–345

331. What is a replica set?

332. Explain:

Primary
Secondary


333. What happens when the primary fails?

334. Explain election.

335. What is the oplog?

336. How does a secondary replicate data?

337. What is replication lag?

338. How would you investigate replication lag?

339. What is read preference?

340. Explain:

primary
primaryPreferred
secondary
secondaryPreferred
nearest


341. What is write concern?

342. Explain:

{ w: "majority" }


343. Explain journaling.

344. Can reads be stale from a secondary?

345. How would you design MongoDB for high availability?

LEVEL 20 — Sharding
Questions 346–365

346. What is sharding?

347. Why would you shard MongoDB?

348. Explain:

mongos
config server
shard


349. What is a shard key?

350. What makes a good shard key?

351. Explain cardinality.

352. Explain frequency.

353. Explain monotonic keys.

354. Explain hotspotting.

355. Explain ranged sharding.

356. Explain hashed sharding.

357. When would you use hashed sharding?

358. When would you use ranged sharding?

359. What are chunks?

360. What does the balancer do?

361. What is a scatter-gather query?

362. How can you avoid scatter-gather queries?

363. Choose a shard key for:

orders
500 million documents


364. Why might orderDate be a poor shard key?

365. Explain what happens when a shard becomes much hotter than the others.

LEVEL 21 — Production Troubleshooting
Questions 366–385

366. CPU suddenly reaches 100%. How do you investigate?

367. Disk I/O suddenly increases. What do you check?

368. Query latency increases from 50ms to 3 seconds. What do you investigate?

369. MongoDB memory usage is extremely high. What do you check?

370. A query performs COLLSCAN on a 500-million-document collection. What do you do?

371. An index exists but isn't being used. Why?

372. A query became slower after adding an index. How could that happen?

373. Database size is growing unexpectedly. How do you investigate?

374. Replication lag suddenly increases. What do you check?

375. Primary elections are happening repeatedly. What could cause this?

376. Application connections are increasing rapidly. What do you investigate?

377. Explain MongoDB connection pooling.

378. How would you investigate connection pool exhaustion?

379. How would you investigate slow queries in production?

380. What is the MongoDB profiler?

381. How would you identify the top slow queries?

382. How would you identify an inefficient aggregation?

383. How would you safely create a new index on a large production collection?

384. How would you migrate a large collection without causing significant downtime?

385. How would you troubleshoot a production MongoDB outage?

LEVEL 22 — Senior/8-Year Scenario Questions
Questions 386–400

These are the ones I would spend the most time practicing for an 8-year interview.

386. Slow Order Query

You have:

db.orders.find({
    userId: X,
    status: "delivered"
}).sort({
    orderDate: -1
}).limit(20)


The collection contains 500 million documents.

Design the optimal index and explain your reasoning.

387. High CPU

MongoDB CPU increased from 30% to 95% after a new application release.

How do you determine whether the problem is:

query
index
aggregation
application
connection pool
sharding


?

388. High Disk I/O

Disk I/O suddenly becomes extremely high.

Explain your investigation process.

389. Replication Lag

Primary is healthy, but secondaries are 10 minutes behind.

What could cause this?

How would you troubleshoot it?

390. Hot Shard

You have four shards:

Shard A  25%
Shard B  25%
Shard C  25%
Shard D  25%


After a new release:

Shard A  20%
Shard B  20%
Shard C  20%
Shard D  40%


Why could this happen?

391. Bad Shard Key

Your application uses:

createdAt


as the shard key.

Orders are inserted continuously.

Explain why this can create a hotspot.

392. Customer Dashboard

Build an aggregation returning:

customer name
total orders
total spending
average order value
last order date
number of cancelled orders
number of returned orders
favorite category

393. Product Dashboard

Build one aggregation returning:

product name
total quantity sold
total revenue
number of orders
number of reviews
average rating
current stock

394. Customer Churn

Find customers who:

have ordered before
but haven't ordered in the last 12 months


Then calculate their total historical spending.

395. Product Performance

Find products that have:

high revenue
high rating
low stock


These are potential inventory risks.

396. Fraud Detection

Find customers where:

many orders
+
many cancelled orders
+
many failed payments


Create a query that identifies suspicious customers.

397. Duplicate Payment Detection

Find possible duplicate payments where:

same user
same amount
same day

398. Customer Lifetime Value

Calculate:

LTV =
total historical spending


for every customer.

Rank customers from highest to lowest.

399. Complete E-Commerce Report

Create one aggregation that returns:

total customers
total products
total orders
total revenue
average order value
total successful payments
total refunds
top 10 products
top 10 customers
revenue by category
revenue by country
monthly revenue


Use $facet where appropriate.

400. Final Production Challenge

You are the senior MongoDB engineer for this application.

The database has:

users        50 million
products      2 million
orders      500 million
reviews     200 million
payments    500 million


The application has:

50,000 requests/second


Current problems:

- Order search is slow
- Customer dashboard takes 5 seconds
- CPU is high
- Disk I/O is high
- Replication lag occurs during peak hours
- One shard is significantly hotter
- Index size is consuming most RAM


Design the complete solution.

Cover:

1. Schema design
2. Index strategy
3. Compound indexes
4. ESR rule
5. Query optimization
6. Aggregation optimization
7. $lookup strategy
8. Read/write patterns
9. Connection pooling
10. Replica set architecture
11. Read preference
12. Write concern
13. Shard key
14. Sharding strategy
15. Hotspot prevention
16. Caching
17. Archiving
18. Data retention
19. Monitoring
20. Backup/recovery
21. Disaster recovery
22. Capacity planning
23. Production deployment strategy

Recommended Practice Order

Don't try to solve all 400 randomly.

Use this sequence:

Week 1
------
1–75
CRUD
Queries
Arrays
Updates


Week 2
------
76–150
Aggregation
Dates
Revenue
Business analytics


Week 3
------
151–220
$unwind
$lookup
$facet
$bucket
Advanced aggregation


Week 4
------
221–280
Dates
Indexes
explain()
Query optimization


Week 5
------
281–330
Schema design
Atomicity
Updates
Transactions


Week 6
------
331–365
Replication
Read/write concerns
Sharding


Week 7
------
366–400
Production troubleshooting
Architecture
Senior-level scenarios

The most important 30 for an 8-year interview

If your interview is soon, prioritize:

57    Array queries
70    $elemMatch
135   Monthly revenue
150   High-value customers
153   Quantity sold
155   Product revenue
163   Customer product count
170   Customer spending
172   Customers with no orders
174   Average product rating
180   Payment → Order → User lookup
185   Top 3 products per category
186   Top customers per country
193   Above-category-average products
198   Monthly revenue growth
200   Window functions
249   Compound index design
250   ESR
253   Index usage
261   explain()
273   Covered query
280   500M-document indexing
287   Prevent large documents
302   Atomic stock decrement
308   Race conditions
318   E-commerce transaction
337   Replication lag
363   Shard-key selection
370   COLLSCAN on 500M documents
387   Production CPU investigation
400   Complete architecture


One correction to the earlier dataset generator: the generated payments collection intentionally has one payment per order, while the payment status can be failed, pending, success, or refunded. That makes it useful for payment analytics, but don't assume every order necessarily has a successful payment when writing your interview queries.