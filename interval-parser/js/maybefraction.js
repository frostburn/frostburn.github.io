var gcd = function(a, b) {
    if (!b) {
        return a;
    }
    return gcd(b, a % b);
}

class MaybeFraction {
    constructor(numerator, denominator) {
        if (denominator === undefined) {
            const token = numerator;
            if (token.includes("/")) {
                [numerator, denominator] = token.split("/", 2);
                this.numerator = parseInt(numerator);
                this.denominator = parseInt(denominator);
            } else if (token.includes(".")) {
                const [wholePart, decimalPart] = token.split(".", 2);
                this.numerator = 0;
                this.denominator = 1;
                decimalPart.split("").forEach(digit => {
                    this.numerator *= 10;
                    this.numerator += parseInt(digit);
                    this.denominator *= 10;
                });
                this.numerator += parseInt(wholePart) * this.denominator;
            } else {
                this.numerator = parseFloat(token);
                if (!isNaN(this.numerator) && this.numerator % 1 == 0) {
                    this.denominator = 1;
                } else {
                    this.denominator = NaN;
                }
            }
        } else {
            this.numerator = numerator;
            this.denominator = denominator;
        }
        this.simplify();
    }

    simplify() {
        if (isNaN(this.denominator)) {
            return;
        }
        const commonFactor = gcd(this.numerator, this.denominator);
        this.numerator /= commonFactor;
        this.denominator /= commonFactor;
    }

    accumulate(other) {
        if (isNaN(this.denominator)) {
            this.numerator += other.toFloat();
        } else if (isNaN(other.denominator)) {
            this.numerator = this.toFloat();
            this.numerator += other.toFloat();
            this.denominator = NaN;
        } else {
            this.numerator = this.numerator * other.denominator + other.numerator * this.denominator;
            this.denominator *= other.denominator;
        }
        this.simplify();
    }

    toString() {
        if (isNaN(this.denominator)) {
            return this.numerator.toString();
        } else {
            if (this.denominator != 1) {
                return this.numerator + "/" + this.denominator;
            } else {
                return this.numerator.toString();
            }
        }
    }

    toFloat() {
        if (isNaN(this.denominator)) {
            return this.numerator;
        }
        return this.numerator / this.denominator;
    }
}
