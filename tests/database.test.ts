import Database from "../src/model/Database";

jest.setTimeout(10000);
test("Connecting to the database works", async () => {
	const database = Database.get();
	{
		await database.query("DELETE FROM test");
		const result = await database.query("SELECT * FROM test");
		expect(result.rowCount).toBe(0);
	}
	{
		await database.query("INSERT INTO test (id, name) VALUES (1, 'test')");
		const result = await database.query("SELECT * FROM test");
		expect(result.rowCount).toBe(1);
	}
});
