const CocoToken = artifacts.require("CocoToken");

const addedZeros = "0".repeat(18);

contract("CocoToken", (accounts) => {
    let token;
    let owner;
    let addr1;
    let addr2;
    let tokenCap = 100000000;
    let tokenBlockReward = 50;

    beforeEach(async () => {
        // Assigning addresses from accounts
        owner = accounts[0];
        addr1 = accounts[1];
        addr2 = accounts[2];
        // Deploy the contract before each test
        token = await CocoToken.deployed(tokenCap, tokenBlockReward); // Initial supply of tokens
    });

    it("should have the correct name and symbol", async () => {
        const name = await token.name();
        const symbol = await token.symbol();
        assert.equal(name, "CocoToken", "Token name should be CocoToken");
        assert.equal(symbol, "CCT", "Token symbol should be CCT");
    });

    it("should assign the initial supply to the owner", async () => {
        const ownerBalance = await token.balanceOf(owner);
        assert.equal(ownerBalance.toString(), "70000000" + addedZeros, "Owner should have 70000000 tokens");
    });

    it("should set max capped supply", async () => {
        const cap = await token.cap();
        assert.equal(cap.toString(), tokenCap.toString() + addedZeros, "Max cap should be 100000000 tokens");
    });

    it("should allow transfer of tokens", async () => {
        // Transfer 100 tokens from the owner to addr1
        await token.transfer(addr1, 100);
        
        const balance1 = await token.balanceOf(owner);
        const balance2 = await token.balanceOf(addr1);
        
        assert.equal(balance1.toString(), "69999900" + addedZeros, "Owner should have 69999900 tokens left");
        assert.equal(balance2.toString(), "100" + addedZeros, "Recipient should have 100 tokens");
    });

    it("should fail to transfer tokens if the sender has insufficient balance", async () => {
        const initialBalance = await token.balanceOf(owner);
        
        // Attempt to transfer more tokens than the owner has
        try {
            await token.transfer(addr1, initialBalance + 1); // Try to transfer more than available
            assert.fail("The transfer should have failed due to insufficient balance");
        } catch (error) {
            assert(
                error.message.includes("revert"),
                "Expected revert error, but got: " + error.message
            );
        }
    });
    
});
