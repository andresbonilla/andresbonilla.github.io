const ColorPicker = artifacts.require('ColorPicker')
const expectedErrorWasNotThrown = new Error('Expected error was not thrown')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function toWei(n) {
  return web3.utils.toWei(n.toString(), 'ether');
}

contract('ColorPicker', ([owner, rando]) => {
  let colorPicker

  beforeEach(async () => {
    colorPicker = await ColorPicker.new()
  })

  describe('Contract deployment', async () => {
    it('the owner is the deployer address', async () => {
      const contractOwner = await colorPicker.getOwner()
      contractOwner.should.equal(owner)
    })

    it('has default balance of zero', async () => {
      const balance = await web3.eth.getBalance(colorPicker.address)
      balance.toString().should.equal('0')
    })

    it('has default color of white', async () => {
      const color = await colorPicker.getColor()
      color.should.equal('0xffffff')
    })

    it('has default cost of 0.001 ETH', async () => {
      const cost = await colorPicker.getCost()
      cost.toString().should.equal(toWei('0.001'))
    })
  })

  describe('setColor feature', async () => {
    describe('errors', async () => {
      it('fails if less than the cost is paid', async () => {
        const newColor = web3.utils.toHex('0x52dae3')
        const cost = await colorPicker.getCost()
        try {
          await colorPicker.setColor(newColor, { from: rando, value: cost - 1 })
          throw expectedErrorWasNotThrown
        } catch (err) {
          err.reason.should.equal('Payment does not equal cost.')
          const color = await colorPicker.getColor()
          color.should.equal('0xffffff')
        }
      })

      it('fails if more than the cost is paid', async () => {
        const newColor = web3.utils.toHex('0x52dae3')
        const cost = await colorPicker.getCost()
        try {
          await colorPicker.setColor(newColor, { from: rando, value: cost + 1 })
          throw expectedErrorWasNotThrown
        } catch (err) {
          err.reason.should.equal('Payment does not equal cost.')
          const color = await colorPicker.getColor()
          color.should.equal('0xffffff')
        }
      })

      it('fails if color is invalid', async () => {
        const newColor = web3.utils.toHex('0x1234567')
        const cost = await colorPicker.getCost()
        try {
          await colorPicker.setColor(newColor, { from: rando, value: cost })
          throw expectedErrorWasNotThrown
        } catch (err) {
          err.reason.should.equal('incorrect data length')
          const color = await colorPicker.getColor()
          color.should.equal('0xffffff')
        }
      })
    })

    describe('success', async () => {
      it('should update the color if the cost is paid', async () => {
        const newColor = web3.utils.toHex('0x55aadd')
        const cost = await colorPicker.getCost()
        await colorPicker.setColor(newColor, { from: rando, value: cost })
        const color = await colorPicker.getColor()
        color.should.equal('0x55aadd')
        const balance = await web3.eth.getBalance(colorPicker.address)
        balance.toString().should.equal(toWei(0.001))
      })
    })
  })

  describe('setCost feature', async () => {
    describe('errors', async () => {
      it('fails if address is not contract ownner', async () => {
        const cost = await colorPicker.getCost()
        try {
          await colorPicker.setCost(toWei('0.0005'), { from: rando })
          throw expectedErrorWasNotThrown
        } catch (err) {
          err.reason.should.equal('Unauthorized access detected.')
          const newCost = await colorPicker.getCost()
          newCost.toString().should.equal(cost.toString())
        }
      })
    })

    describe('success', async () => {
      it('updates the cost if address is the contract ownner', async () => {
        await colorPicker.setCost(toWei('0.0005'), { from: owner })
        const newCost = await colorPicker.getCost()
        newCost.toString().should.equal(toWei('0.0005'))
      })
    })
  })

  describe('withdraw feature', async () => {
    describe('errors', async () => {
      it('fails if address is not contract ownner', async () => {
        const newColor = web3.utils.toHex('0x22ccff')
        const cost = await colorPicker.getCost()
        await colorPicker.setColor(newColor, { from: rando, value: cost })
        const contractBalance = await web3.eth.getBalance(colorPicker.address)
        try {
          await colorPicker.withdrawBalance({ from: rando })
          throw expectedErrorWasNotThrown
        } catch (err) {
          err.reason.should.equal('Unauthorized access detected.')
          const newContractBalance = await web3.eth.getBalance(colorPicker.address)
          newContractBalance.toString().should.equal(contractBalance.toString())
        }
      })

      it('fails if balance is empty', async () => {
        try {
          await colorPicker.withdrawBalance({ from: owner })
          throw expectedErrorWasNotThrown
        } catch (err) {
          err.reason.should.equal('Contract balance is zero.')
        }
      })
    })

    describe('success', async () => {
      it('the owner should be able to withdraw the balance', async () => {
        const newColor = web3.utils.toHex('0x55aadd')
        await colorPicker.setColor(newColor, { from: rando, value: toWei(0.001) })

        const contractBalance = await web3.eth.getBalance(colorPicker.address)
        contractBalance.toString().should.equal(toWei(0.001))
        
        const ownerBalance = await web3.eth.getBalance(owner)

        await colorPicker.withdrawBalance({ from: owner })
        
        const newContractBalance = await web3.eth.getBalance(colorPicker.address)
        newContractBalance.toString().should.equal('0')
        
        const newOwnerBalance = await web3.eth.getBalance(owner)
        Number(newOwnerBalance).should.be.greaterThan(Number(ownerBalance))
      })
    })
  })
})
