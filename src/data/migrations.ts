import connection from "./connection";

const printError = (error: any) => { console.log(error.sqlMessage || error.message) };

const createTables = async (): Promise<void> => {
    await connection.raw(`  
        CREATE TABLE IF NOT EXISTS Students_LabeDrinks (
            author VARCHAR(255) PRIMARY KEY NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Drinks (
            id VARCHAR(255) PRIMARY KEY NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            rating FLOAT NOT NULL,
            author VARCHAR(255) NOT NULL,
            FOREIGN KEY (author) REFERENCES Students_LabeDrinks(author)
        );
        `)
        .then(() => console.log("Tables created successfully!"))
        .catch(printError);
};

const closeConnection = (): Promise<void> => {
    return connection.destroy();
}

const up = async () => {
    try {
        await createTables();
    } catch (error: any) {
        throw new Error(error.sqlMessage);
    } finally {
        closeConnection();
    }
};

up().then(res => console.log("Ending migrations!")).catch(error => console.log(error));