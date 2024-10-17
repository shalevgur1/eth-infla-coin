const InflaToken = artifacts.require("InflaToken");

const addedZeros = ""; //"0".repeat(18);

contract("InflaToken", (accounts) => {
    let token;
    let owner;
    let addr1;
    let addr2;
    let blockReward = 0;
    let initialSupply = 0;

    beforeEach(async () => {
        // Assigning addresses from accounts
        owner = accounts[0];
        addr1 = accounts[1];
        addr2 = accounts[2];
        // Deploy the contract before each test
        token = await InflaToken.deployed(initialSupply, blockReward); // Initial supply of tokens
    });

    it("should have the correct name and symbol", async () => {
        const name = await token.name();
        const symbol = await token.symbol();
        assert.equal(name, "InflaToken", "Token name should be InflaToken");
        assert.equal(symbol, "INF", "Token symbol should be CCT");
    });

    it("should assign the initial supply to the owner", async () => {
        const ownerBalance = await token.balanceOf(owner);
        if(initialSupply === 0)
            assert.equal(ownerBalance.toString(), "10000" + addedZeros, "Owner should have 10000 tokens");
        else
            assert.equal(ownerBalance.toString(), initialSupply.toString() + addedZeros, `Owner should have ${initialSupply} tokens`);
    });

    it("should allow transfer of tokens", async () => {
        // Transfer 10 tokens from the owner to addr1
        await token.transfer(addr1, 10);

        const balance1 = await token.balanceOf(owner);
        const balance2 = await token.balanceOf(addr1);
        
        assert.equal(balance1.toString(), "9990" + addedZeros, "Owner should have 9990 tokens left");
        assert.equal(balance2.toString(), "10" + addedZeros, "Recipient should have 10 tokens");
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

    it("should transfer specified amount of tokens to specified account from the centralBank", async () => {
        // Attempt to faucet 100 tokens to specified account
        await token.faucet(addr2, 100);

        const balance1 = await token.balanceOf(owner);
        const balance2 = await token.balanceOf(addr2);
        
        assert.equal(balance1.toString(), "9890" + addedZeros, "Owner should have 9900 tokens left");
        assert.equal(balance2.toString(), "100" + addedZeros, "Recipient should have 100 tokens");
    });

    // it("should mint miner rewards on transfer", async () => {
    //     // let minerAddr = await token.getMinerAddr(); // web3.eth.getCoinbase()
    //     // console.log(minerAddr);
    //     // const initialMinerBalance = await token.balanceOf(minerAddr);
    //     // console.log(initialMinerBalance);
    //     const result = await token.transfer(addr1, 10);
    //     result.logs.forEach(log => {
    //         if (log.event === "DebugInfo") {
    //             console.log("Debug Info:", log.args);
    //         }
    //     });
    // });
    
});
