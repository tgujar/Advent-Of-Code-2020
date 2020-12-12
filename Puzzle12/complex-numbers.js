class ComplexNumber {
  constructor(a, b) {
    this.real = a;
    this.imag = b;
  }

  add(num) {
    return new ComplexNumber(this.real + num.real, this.imag + num.imag);
  }

  sub(num) {
    return new ComplexNumber(this.real - num.real, this.imag - num.imag);
  }

  div(num) {
    return new ComplexNumber(
      this.mul(num.conj).real / num.abs**2,
      this.mul(num.conj).imag / num.abs**2
    )
  }

  mul(num) {
    return new ComplexNumber(
      this.real * num.real - this.imag * num.imag,
      this.real * num.imag + this.imag * num.real
    )
  }

  get abs() {
    return Math.sqrt(this.real**2 + this.imag**2);  
  }

  get conj() {
    return new ComplexNumber(this.real, this.imag ? -this.imag : 0)
  }

  get exp() {
    return new ComplexNumber(Math.E**this.real, 0).mul(
      new ComplexNumber(Math.cos(this.imag), Math.sin(this.imag)));
  }
}

module.exports = ComplexNumber;  