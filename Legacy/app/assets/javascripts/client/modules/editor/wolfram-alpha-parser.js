/* global app

{
  function brackets_subtype(c) {
    switch(c) {
      case "[":
        return "square";
      case "(":
        return "round";
      default:
        return "curly";
    }
  }

  function radial_subtype(c) {
    if(c.type == 'word' || c.type == 'simple'){
      switch(c.text) {
        case "integral":
          return "integral";
        case "log":
          return "logarithm";
        case "product":
          return "product";
        case "sum":
          return "summation";
        default:
          return "regular";
      }
    }else{
      return "regular"
    }
  }

  function remove_undefined(array) {
    var filtered = array.filter(function (item) {return item !== undefined});
    if(filtered.length > 0){
      return filtered[0];
    }else{
      return '';
    }
  }

  function matrix_row(first, rest){
    function cleanup(cell){
      var filtered = cell.filter(function (item) {
        return item.hasOwnProperty('type') && item.type == 'cell';
      });
      return filtered[0];
    }

    rest = rest.map(cleanup);
    return {type: 'row', cells: [first].concat(rest)};
  }

  function matrix(first, rest){
    function cleanup(row){
      var filtered = row.filter(function (item) {
        return item.hasOwnProperty('type') && item.type == 'row';
      });
      return filtered[0];
    }

    rest = rest.map(cleanup)
    var rows = [first].concat(rest);

    return {
      type: 'matrix',
      rows: rows
    };
  }
}

Expressions
  = exp:Expression+ {
    return exp;
  }

Expression = e:(Fraction / Radial / Indefinite / Term / WordSpace) { return e; }
Term = t:(Function / Matrix / Brackets / Simple / Word) { return t; }
Function = fun:(Sqrt / Log / Trigonometric) { return fun; }
Indefinite = fun:(IndefiniteIntegral / IndefiniteSum / IndefiniteProduct) { return fun; }

OperatorSpace = " "*
WordSpace = " " { return {type: 'simple', text: ' '}; }

Simple
  = OperatorSpace text:(
      "!=" / "~~" / "=" / ">=" / ">" / "<=" /
      "<" / "+" / "±" / "-" / "∓" / "*" /
      "infinity" / "element" / "\n"
    ) OperatorSpace {
    return {type: 'simple', text: text};
  }

Number
  = text:[0-9,\.]+ {
    return {type: 'word', text: text.join('')};
  }

Word
  = text:(!WordSpace !Function !Indefinite !Simple !OpenBracket !ClosedBracket ![/_^] .)+{
    return {type: 'word', text: text.map(remove_undefined).join('')};
  }

// Matrix
MatrixCell = OperatorSpace exp:MatrixExpression+ OperatorSpace { return {type: 'cell', expressions: exp }; }
MatrixExpression = e:(Fraction / Radial / Function / Brackets / MatrixSimple / MatrixWord) { return e; }
MatrixSimple = !'\n' simple:Simple { return simple }
MatrixWord = !'|' word:Word { return word }
MatrixRow = first:MatrixCell rest:('|'MatrixCell)+ {
 return matrix_row(first, rest);
}
Matrix
  = OpenBracket first:MatrixRow rest:('\n' MatrixRow)* ClosedBracket {
    return matrix(first, rest);
  }

Brackets
  = ob:OpenBracket exp:Expressions ClosedBracket {
   return {type: 'brackets', subtype: brackets_subtype(ob), expressions: exp};
 }

Fraction
  = a:(Radial / Term) "/" b:(Radial / Term) {
    return {type: 'fraction', upper: a, lower: b};
  }

Sqrt
  = "sqrt" OpenBracket exp:Expressions ClosedBracket {
    return {type: 'sqrt' , expression: exp};
  }

Radial
  = c:Term "_" br:Term "^" tr:Term {
    return {type: 'radial', subtype: radial_subtype(c), c: c, tr: tr, br: br};
  }
  / c:Term "_" br:Term {
    return {type: 'radial', subtype: radial_subtype(c), c: c, br: br};
  }
  / c:Term "^" tr:Term {
    return {type: 'radial', subtype: radial_subtype(c), c: c, tr: tr};
  }

IndefiniteIntegral
  = "integral" {
    return {type: "radial", subtype: 'integral'};
  }

IndefiniteSum
  = "sum" {
    return {type: 'radial', subtype: 'summation'};
  }

IndefiniteProduct
  = "product" {
    return {type: 'radial', subtype: 'product'};
  }

Log
  = "log" OpenBracket exp:Expressions ClosedBracket {
    return {type: 'log', expressions: exp, base: null};
  }
  / "log" OpenBracket base:Expressions ", " exp:Expressions ClosedBracket {
    return {type: 'log', expressions: exp, base: base};
  }

Trigonometric
 = type:("sin" / "cos" / "tan") e:Brackets {
  return {type: 'trigonometric', subtype: type, expression:e};
  }

OpenBracket = ob:("(" / "[" / "{") { return ob; }
ClosedBracket = ")" / "]" / "}"
*/

app.modules.wolfram_alpha.parser =
  /*
   * Generated by PEG.js 0.10.0.
   *
   * http://pegjs.org/
   */
  (function () {
    "use strict";

    function peg$subclass(child, parent) {
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
    }

    function peg$SyntaxError(message, expected, found, location) {
      this.message = message;
      this.expected = expected;
      this.found = found;
      this.location = location;
      this.name = "SyntaxError";

      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, peg$SyntaxError);
      }
    }

    peg$subclass(peg$SyntaxError, Error);

    peg$SyntaxError.buildMessage = function (expected, found) {
      var DESCRIBE_EXPECTATION_FNS = {
        literal: function (expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function (expectation) {
          var escapedParts = "",
            i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array ?
              classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1]) :
              classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function (expectation) {
          return "any character";
        },

        end: function (expectation) {
          return "end of input";
        },

        other: function (expectation) {
          return expectation.description;
        }
      };

      function hex(ch) {
        return ch.charCodeAt(0).toString(16).toUpperCase();
      }

      function literalEscape(s) {
        return s
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\0/g, '\\0')
          .replace(/\t/g, '\\t')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/[\x00-\x0F]/g, function (ch) {
            return '\\x0' + hex(ch);
          })
          .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
            return '\\x' + hex(ch);
          });
      }

      function classEscape(s) {
        return s
          .replace(/\\/g, '\\\\')
          .replace(/\]/g, '\\]')
          .replace(/\^/g, '\\^')
          .replace(/-/g, '\\-')
          .replace(/\0/g, '\\0')
          .replace(/\t/g, '\\t')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/[\x00-\x0F]/g, function (ch) {
            return '\\x0' + hex(ch);
          })
          .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
            return '\\x' + hex(ch);
          });
      }

      function describeExpectation(expectation) {
        return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
      }

      function describeExpected(expected) {
        var descriptions = new Array(expected.length),
          i, j;

        for (i = 0; i < expected.length; i++) {
          descriptions[i] = describeExpectation(expected[i]);
        }

        descriptions.sort();

        if (descriptions.length > 0) {
          for (i = 1, j = 1; i < descriptions.length; i++) {
            if (descriptions[i - 1] !== descriptions[i]) {
              descriptions[j] = descriptions[i];
              j++;
            }
          }
          descriptions.length = j;
        }

        switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ") +
            ", or " +
            descriptions[descriptions.length - 1];
        }
      }

      function describeFound(found) {
        return found ? "\"" + literalEscape(found) + "\"" : "end of input";
      }

      return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
    };

    function peg$parse(input, options) {
      options = options !== void 0 ? options : {};

      var peg$FAILED = {},

        peg$startRuleIndices = {
          Expressions: 0
        },
        peg$startRuleIndex = 0,

        peg$consts = [
          function (exp) {
            return exp;
          },
          function (e) {
            return e;
          },
          function (t) {
            return t;
          },
          function (fun) {
            return fun;
          },
          " ",
          peg$literalExpectation(" ", false),
          function () {
            return {
              type: 'simple',
              text: ' '
            };
          },
          "!=",
          peg$literalExpectation("!=", false),
          "~~",
          peg$literalExpectation("~~", false),
          "=",
          peg$literalExpectation("=", false),
          ">=",
          peg$literalExpectation(">=", false),
          ">",
          peg$literalExpectation(">", false),
          "<=",
          peg$literalExpectation("<=", false),
          "<",
          peg$literalExpectation("<", false),
          "+",
          peg$literalExpectation("+", false),
          "\xB1",
          peg$literalExpectation("\xB1", false),
          "-",
          peg$literalExpectation("-", false),
          "∓",
          peg$literalExpectation("∓", false),
          "*",
          peg$literalExpectation("*", false),
          "infinity",
          peg$literalExpectation("infinity", false),
          "element",
          peg$literalExpectation("element", false),
          "\n",
          peg$literalExpectation("\n", false),
          function (text) {
            return {
              type: 'simple',
              text: text
            };
          },
          /^[0-9,.]/,
          peg$classExpectation([
            ["0", "9"], ",", "."
          ], false, false),
          function (text) {
            return {
              type: 'word',
              text: text.join('')
            };
          },
          /^[\/_\^]/,
          peg$classExpectation(["/", "_", "^"], false, false),
          peg$anyExpectation(),
          function (text) {
            return {
              type: 'word',
              text: text.map(remove_undefined).join('')
            };
          },
          function (exp) {
            return {
              type: 'cell',
              expressions: exp
            };
          },
          function (simple) {
            return simple
          },
          "|",
          peg$literalExpectation("|", false),
          function (word) {
            return word
          },
          function (first, rest) {
            return matrix_row(first, rest);
          },
          function (first, rest) {
            return matrix(first, rest);
          },
          function (ob, exp) {
            return {
              type: 'brackets',
              subtype: brackets_subtype(ob),
              expressions: exp
            };
          },
          "/",
          peg$literalExpectation("/", false),
          function (a, b) {
            return {
              type: 'fraction',
              upper: a,
              lower: b
            };
          },
          "sqrt",
          peg$literalExpectation("sqrt", false),
          function (exp) {
            return {
              type: 'sqrt',
              expression: exp
            };
          },
          "_",
          peg$literalExpectation("_", false),
          "^",
          peg$literalExpectation("^", false),
          function (c, br, tr) {
            return {
              type: 'radial',
              subtype: radial_subtype(c),
              c: c,
              tr: tr,
              br: br
            };
          },
          function (c, br) {
            return {
              type: 'radial',
              subtype: radial_subtype(c),
              c: c,
              br: br
            };
          },
          function (c, tr) {
            return {
              type: 'radial',
              subtype: radial_subtype(c),
              c: c,
              tr: tr
            };
          },
          "integral",
          peg$literalExpectation("integral", false),
          function () {
            return {
              type: "radial",
              subtype: 'integral'
            };
          },
          "sum",
          peg$literalExpectation("sum", false),
          function () {
            return {
              type: 'radial',
              subtype: 'summation'
            };
          },
          "product",
          peg$literalExpectation("product", false),
          function () {
            return {
              type: 'radial',
              subtype: 'product'
            };
          },
          "log",
          peg$literalExpectation("log", false),
          function (exp) {
            return {
              type: 'log',
              expressions: exp,
              base: null
            };
          },
          ", ",
          peg$literalExpectation(", ", false),
          function (base, exp) {
            return {
              type: 'log',
              expressions: exp,
              base: base
            };
          },
          "sin",
          peg$literalExpectation("sin", false),
          "cos",
          peg$literalExpectation("cos", false),
          "tan",
          peg$literalExpectation("tan", false),
          function (type, e) {
            return {
              type: 'trigonometric',
              subtype: type,
              expression: e
            };
          },
          "(",
          peg$literalExpectation("(", false),
          "[",
          peg$literalExpectation("[", false),
          "{",
          peg$literalExpectation("{", false),
          function (ob) {
            return ob;
          },
          ")",
          peg$literalExpectation(")", false),
          "]",
          peg$literalExpectation("]", false),
          "}",
          peg$literalExpectation("}", false)
        ],

        peg$bytecode = [
          peg$decode("%$;!/&#0#*;!&&&#/' 8!: !! )"),
          peg$decode("%;1.5 &;3./ &;$.) &;\".# &;&/' 8!:!!! )"),
          peg$decode("%;#.5 &;/./ &;0.) &;'.# &;)/' 8!:\"!! )"),
          peg$decode("%;2.) &;7.# &;8/' 8!:#!! )"),
          peg$decode("%;4.) &;5.# &;6/' 8!:#!! )"),
          peg$decode("$2$\"\"6$7%0)*2$\"\"6$7%&"),
          peg$decode("%2$\"\"6$7%/& 8!:&! )"),
          peg$decode("%;%/\xE8#2'\"\"6'7(.\xC5 &2)\"\"6)7*.\xB9 &2+\"\"6+7,.\xAD &2-\"\"6-7..\xA1 &2/\"\"6/70.\x95 &21\"\"6172.\x89 &23\"\"6374.} &25\"\"6576.q &27\"\"6778.e &29\"\"697:.Y &2;\"\"6;7<.M &2=\"\"6=7>.A &2?\"\"6?7@.5 &2A\"\"6A7B.) &2C\"\"6C7D/1$;%/($8#:E#!!)(#'#(\"'#&'#"),
          peg$decode("%$4F\"\"5!7G/,#0)*4F\"\"5!7G&&&#/' 8!:H!! )"),
          peg$decode("%$%%<;&=.##&&!&'#/\xB5#%<;#=.##&&!&'#/\xA0$%<;$=.##&&!&'#/\x8B$%<;'=.##&&!&'#/v$%<;9=.##&&!&'#/a$%<;:=.##&&!&'#/L$%<4I\"\"5!7J=.##&&!&'#/1$1\"\"5!7K/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#/\xCE#0\xCB*%%<;&=.##&&!&'#/\xB5#%<;#=.##&&!&'#/\xA0$%<;$=.##&&!&'#/\x8B$%<;'=.##&&!&'#/v$%<;9=.##&&!&'#/a$%<;:=.##&&!&'#/L$%<4I\"\"5!7J=.##&&!&'#/1$1\"\"5!7K/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#&&&#/' 8!:L!! )"),
          peg$decode("%;%/G#$;+/&#0#*;+&&&#/1$;%/($8#:M#!!)(#'#(\"'#&'#"),
          peg$decode("%;1.; &;3.5 &;#./ &;0.) &;,.# &;-/' 8!:!!! )"),
          peg$decode("%%<2C\"\"6C7D=.##&&!&'#/1#;'/($8\":N\"! )(\"'#&'#"),
          peg$decode("%%<2O\"\"6O7P=.##&&!&'#/1#;)/($8\":Q\"! )(\"'#&'#"),
          peg$decode("%;*/q#$%2O\"\"6O7P/,#;*/#$+\")(\"'#&'#/?#0<*%2O\"\"6O7P/,#;*/#$+\")(\"'#&'#&&&#/)$8\":R\"\"! )(\"'#&'#"),
          peg$decode("%;9/}#;./t$$%2C\"\"6C7D/,#;./#$+\")(\"'#&'#0<*%2C\"\"6C7D/,#;./#$+\")(\"'#&'#&/2$;:/)$8$:S$\"\"!)($'#(#'#(\"'#&'#"),
          peg$decode("%;9/;#; /2$;:/)$8#:T#\"\"!)(#'#(\"'#&'#"),
          peg$decode("%;3.# &;\"/G#2U\"\"6U7V/8$;3.# &;\"/)$8#:W#\"\" )(#'#(\"'#&'#"),
          peg$decode("%2X\"\"6X7Y/C#;9/:$; /1$;:/($8$:Z$!!)($'#(#'#(\"'#&'#"),
          peg$decode("%;\"/Z#2[\"\"6[7\\/K$;\"/B$2]\"\"6]7^/3$;\"/*$8%:_%#$\" )(%'#($'#(#'#(\"'#&'#.y &%;\"/A#2[\"\"6[7\\/2$;\"/)$8#:`#\"\" )(#'#(\"'#&'#.K &%;\"/A#2]\"\"6]7^/2$;\"/)$8#:a#\"\" )(#'#(\"'#&'#"),
          peg$decode("%2b\"\"6b7c/& 8!:d! )"),
          peg$decode("%2e\"\"6e7f/& 8!:g! )"),
          peg$decode("%2h\"\"6h7i/& 8!:j! )"),
          peg$decode("%2k\"\"6k7l/C#;9/:$; /1$;:/($8$:m$!!)($'#(#'#(\"'#&'#.l &%2k\"\"6k7l/\\#;9/S$; /J$2n\"\"6n7o/;$; /2$;:/)$8&:p&\"#!)(&'#(%'#($'#(#'#(\"'#&'#"),
          peg$decode("%2q\"\"6q7r.5 &2s\"\"6s7t.) &2u\"\"6u7v/2#;0/)$8\":w\"\"! )(\"'#&'#"),
          peg$decode("%2x\"\"6x7y.5 &2z\"\"6z7{.) &2|\"\"6|7}/' 8!:~!! )"),
          peg$decode("2\x7F\"\"6\x7F7\x80.5 &2\x81\"\"6\x817\x82.) &2\x83\"\"6\x837\x84")
        ],

        peg$currPos = 0,
        peg$savedPos = 0,
        peg$posDetailsCache = [{
          line: 1,
          column: 1
        }],
        peg$maxFailPos = 0,
        peg$maxFailExpected = [],
        peg$silentFails = 0,

        peg$result;

      if ("startRule" in options) {
        if (!(options.startRule in peg$startRuleIndices)) {
          throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
        }

        peg$startRuleIndex = peg$startRuleIndices[options.startRule];
      }

      function text() {
        return input.substring(peg$savedPos, peg$currPos);
      }

      function location() {
        return peg$computeLocation(peg$savedPos, peg$currPos);
      }

      function expected(description, location) {
        location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

        throw peg$buildStructuredError(
          [peg$otherExpectation(description)],
          input.substring(peg$savedPos, peg$currPos),
          location
        );
      }

      function error(message, location) {
        location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

        throw peg$buildSimpleError(message, location);
      }

      function peg$literalExpectation(text, ignoreCase) {
        return {
          type: "literal",
          text: text,
          ignoreCase: ignoreCase
        };
      }

      function peg$classExpectation(parts, inverted, ignoreCase) {
        return {
          type: "class",
          parts: parts,
          inverted: inverted,
          ignoreCase: ignoreCase
        };
      }

      function peg$anyExpectation() {
        return {
          type: "any"
        };
      }

      function peg$endExpectation() {
        return {
          type: "end"
        };
      }

      function peg$otherExpectation(description) {
        return {
          type: "other",
          description: description
        };
      }

      function peg$computePosDetails(pos) {
        var details = peg$posDetailsCache[pos],
          p;

        if (details) {
          return details;
        }
        else {
          p = pos - 1;
          while (!peg$posDetailsCache[p]) {
            p--;
          }

          details = peg$posDetailsCache[p];
          details = {
            line: details.line,
            column: details.column
          };

          while (p < pos) {
            if (input.charCodeAt(p) === 10) {
              details.line++;
              details.column = 1;
            }
            else {
              details.column++;
            }

            p++;
          }

          peg$posDetailsCache[pos] = details;
          return details;
        }
      }

      function peg$computeLocation(startPos, endPos) {
        var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails = peg$computePosDetails(endPos);

        return {
          start: {
            offset: startPos,
            line: startPosDetails.line,
            column: startPosDetails.column
          },
          end: {
            offset: endPos,
            line: endPosDetails.line,
            column: endPosDetails.column
          }
        };
      }

      function peg$fail(expected) {
        if (peg$currPos < peg$maxFailPos) {
          return;
        }

        if (peg$currPos > peg$maxFailPos) {
          peg$maxFailPos = peg$currPos;
          peg$maxFailExpected = [];
        }

        peg$maxFailExpected.push(expected);
      }

      function peg$buildSimpleError(message, location) {
        return new peg$SyntaxError(message, null, null, location);
      }

      function peg$buildStructuredError(expected, found, location) {
        return new peg$SyntaxError(
          peg$SyntaxError.buildMessage(expected, found),
          expected,
          found,
          location
        );
      }

      function peg$decode(s) {
        var bc = new Array(s.length),
          i;

        for (i = 0; i < s.length; i++) {
          bc[i] = s.charCodeAt(i) - 32;
        }

        return bc;
      }

      function peg$parseRule(index) {
        var bc = peg$bytecode[index],
          ip = 0,
          ips = [],
          end = bc.length,
          ends = [],
          stack = [],
          params, i;

        while (true) {
          while (ip < end) {
            switch (bc[ip]) {
            case 0:
              stack.push(peg$consts[bc[ip + 1]]);
              ip += 2;
              break;

            case 1:
              stack.push(void 0);
              ip++;
              break;

            case 2:
              stack.push(null);
              ip++;
              break;

            case 3:
              stack.push(peg$FAILED);
              ip++;
              break;

            case 4:
              stack.push([]);
              ip++;
              break;

            case 5:
              stack.push(peg$currPos);
              ip++;
              break;

            case 6:
              stack.pop();
              ip++;
              break;

            case 7:
              peg$currPos = stack.pop();
              ip++;
              break;

            case 8:
              stack.length -= bc[ip + 1];
              ip += 2;
              break;

            case 9:
              stack.splice(-2, 1);
              ip++;
              break;

            case 10:
              stack[stack.length - 2].push(stack.pop());
              ip++;
              break;

            case 11:
              stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));
              ip += 2;
              break;

            case 12:
              stack.push(input.substring(stack.pop(), peg$currPos));
              ip++;
              break;

            case 13:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1]) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              }
              else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 14:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1] === peg$FAILED) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              }
              else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 15:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1] !== peg$FAILED) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              }
              else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 16:
              if (stack[stack.length - 1] !== peg$FAILED) {
                ends.push(end);
                ips.push(ip);

                end = ip + 2 + bc[ip + 1];
                ip += 2;
              }
              else {
                ip += 2 + bc[ip + 1];
              }

              break;

            case 17:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (input.length > peg$currPos) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              }
              else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 18:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length) === peg$consts[bc[ip + 1]]) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              }
              else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 19:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length).toLowerCase() === peg$consts[bc[ip + 1]]) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              }
              else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 20:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (peg$consts[bc[ip + 1]].test(input.charAt(peg$currPos))) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              }
              else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 21:
              stack.push(input.substr(peg$currPos, bc[ip + 1]));
              peg$currPos += bc[ip + 1];
              ip += 2;
              break;

            case 22:
              stack.push(peg$consts[bc[ip + 1]]);
              peg$currPos += peg$consts[bc[ip + 1]].length;
              ip += 2;
              break;

            case 23:
              stack.push(peg$FAILED);
              if (peg$silentFails === 0) {
                peg$fail(peg$consts[bc[ip + 1]]);
              }
              ip += 2;
              break;

            case 24:
              peg$savedPos = stack[stack.length - 1 - bc[ip + 1]];
              ip += 2;
              break;

            case 25:
              peg$savedPos = peg$currPos;
              ip++;
              break;

            case 26:
              params = bc.slice(ip + 4, ip + 4 + bc[ip + 3]);
              for (i = 0; i < bc[ip + 3]; i++) {
                params[i] = stack[stack.length - 1 - params[i]];
              }

              stack.splice(
                stack.length - bc[ip + 2],
                bc[ip + 2],
                peg$consts[bc[ip + 1]].apply(null, params)
              );

              ip += 4 + bc[ip + 3];
              break;

            case 27:
              stack.push(peg$parseRule(bc[ip + 1]));
              ip += 2;
              break;

            case 28:
              peg$silentFails++;
              ip++;
              break;

            case 29:
              peg$silentFails--;
              ip++;
              break;

            default:
              throw new Error("Invalid opcode: " + bc[ip] + ".");
            }
          }

          if (ends.length > 0) {
            end = ends.pop();
            ip = ips.pop();
          }
          else {
            break;
          }
        }

        return stack[0];
      }


      function brackets_subtype(c) {
        switch (c) {
        case "[":
          return "square";
        case "(":
          return "round";
        default:
          return "curly";
        }
      }

      function radial_subtype(c) {
        if (c.type == 'word' || c.type == 'simple') {
          switch (c.text) {
          case "integral":
            return "integral";
          case "log":
            return "logarithm";
          case "product":
            return "product";
          case "sum":
            return "summation";
          default:
            return "regular";
          }
        }
        else {
          return "regular"
        }
      }

      function remove_undefined(array) {
        var filtered = array.filter(function (item) {
          return item !== undefined
        });
        if (filtered.length > 0) {
          return filtered[0];
        }
        else {
          return '';
        }
      }

      function matrix_row(first, rest) {
        function cleanup(cell) {
          var filtered = cell.filter(function (item) {
            return item.hasOwnProperty('type') && item.type == 'cell';
          });
          return filtered[0];
        }

        rest = rest.map(cleanup);
        return {
          type: 'row',
          cells: [first].concat(rest)
        };
      }

      function matrix(first, rest) {
        function cleanup(row) {
          var filtered = row.filter(function (item) {
            return item.hasOwnProperty('type') && item.type == 'row';
          });
          return filtered[0];
        }

        rest = rest.map(cleanup)
        var rows = [first].concat(rest);

        return {
          type: 'matrix',
          rows: rows
        };
      }


      peg$result = peg$parseRule(peg$startRuleIndex);

      if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
      }
      else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
          peg$fail(peg$endExpectation());
        }

        throw peg$buildStructuredError(
          peg$maxFailExpected,
          peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
          peg$maxFailPos < input.length ?
          peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) :
          peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
        );
      }
    }

    return {
      SyntaxError: peg$SyntaxError,
      parse: peg$parse
    };
  })();
