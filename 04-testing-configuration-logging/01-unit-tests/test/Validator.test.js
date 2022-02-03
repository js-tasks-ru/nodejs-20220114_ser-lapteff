const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет на соответствие типа', () => {
      const validator = new Validator({
        name: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'Lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });
    it('валидатор проверяет строковые поля на минимум', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'Lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });
    it('валидатор проверяет строковые поля на максимум', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 8,
        },
      });

      const errors = validator.validate({name: 'Lalalalal'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 8, got 9');
    });
    it('валидатор проверяет числовые поля на минимум', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 33,
        },
      });

      const errors = validator.validate({age: 17});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17');
    });
    it('валидатор проверяет числовые поля на максимум', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 33,
        },
      });

      const errors = validator.validate({age: 34});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 33, got 34');
    });
  });
});
