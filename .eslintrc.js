module.exports = {
    "globals": {
        "$": true,
        "mta": true,
        "nw": true,
        "fabric": true
    },
    "quiet": true,
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "rules": {
        "brace-style": [
            1,
            "1tbs",
            {
                "allowSingleLine": true
            }
        ],
        "camelcase": 1,
        "comma-dangle": [
            2,
            "never"
        ],
        "comma-spacing": [
            0,
            {
                "before": false,
                "after": true
            }
        ],
        "comma-style": [
            1,
            "last"
        ],
        "consistent-this": [
            1,
            "self"
        ],
        "curly": [
            2,
            "multi-line"
        ],
        "eqeqeq": [
            1,
            "allow-null"
        ],
        "eol-last": 1,
        "guard-for-in": 0,
        "indent": [
            2,
            4,
            {
                "SwitchCase": 1
            }
        ],
        "key-spacing": 0,
        "new-cap": [
            1,
            {
                "capIsNew": false,
                "newIsCap": true
            }
        ],
        "no-empty": 2,
        "new-parens": 0,
        "no-bitwise": 0,
        "no-cond-assign": 1,
        "no-console": 2,
        "no-constant-condition": 1,
        "no-delete-var": 2,
        "no-debugger": 2,
        "no-dupe-keys": 2,
        "no-duplicate-case": 2,
        "no-eval": 1,
        "no-ex-assign": 1,
        "no-extend-native": 1,
        "no-floating-decimal": 1,
        "no-func-assign": 1,
        "no-implied-eval": 1,
        "no-inner-declarations": 1,
        "no-invalid-regexp": 1,
        "no-irregular-whitespace": 1,
        "no-iterator": 1,
        "no-labels": 1,
        "no-lonely-if": 1,
        "no-loop-func": 1,
        "no-mixed-spaces-and-tabs": 1,
        "no-native-reassign": 2,
        "no-negated-in-lhs": 1,
        "no-new-func": 1,
        "no-new-object": 1,
        "no-new-wrappers": 2,
        "no-obj-calls": 1,
        "no-octal": 1,
        "no-plusplus": 0,
        "no-proto": 2,
        "no-redeclare": 2,
        "no-return-assign": 1,
        "no-self-compare": 1,
        "no-sequences": 1,
        "no-script-url": 0,
        "no-shadow": 0,
        "no-spaced-func": 1,
        "no-sparse-arrays": 1,
        "no-throw-literal": 1,
        "no-alert": 2,
        "no-trailing-spaces": 1,
        "no-unused-vars": [
            2,
            {
                "vars": "all",
                "args": "none"
            }
        ],
        "use-isnan": 2,
        "no-unreachable": 2,
        "no-undef": 2,
        "no-undefined": 2,
        "no-undef-init": 1,
        "no-underscore-dangle": 0,
        "no-use-before-define": [
            2,
            "nofunc"
        ],
        "no-warning-comments": [
            0,
            {
                "terms": [
                    "todo",
                    "fixme"
                ]
            }
        ],
        "array-callback-return": [
            2
        ],
        "quotes": [
            1,
            "single",
            "avoid-escape"
        ],
        "quote-props": [
            0,
            "as-needed"
        ],
        "radix": 1,
        "semi": 1,
        "space-before-blocks": [
            1,
            "always"
        ],
        "space-infix-ops": 1,
        "space-in-parens": [
            1,
            "never"
        ],
        "space-unary-ops": [
            1,
            {
                "words": true,
                "nonwords": false
            }
        ],
        "valid-typeof": 1,
        "vars-on-top": 0,
        // disabled for now, see github.com/eslint/eslint/issues/2099
        "wrap-iife": [
            1,
            "inside"
        ],
        "yoda": 0,
        // Node.js specific
        "handle-callback-err": [
            1,
            "^(err|error)$"
        ],
        "no-mixed-requires": 1,
        "no-new-require": 1,
        "no-path-concat": 1,
        "react/jsx-uses-react": 1,
        "react/jsx-uses-vars": 1,
        "react/jsx-no-bind": 1,
        "react/react-in-jsx-scope": 1,
        "react/no-string-refs": 1,
        "react/jsx-indent": 1
    },
    "plugins": [
        "react"
    ]
}
