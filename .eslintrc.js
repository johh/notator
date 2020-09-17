module.exports = {
	"extends": [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		"airbnb-typescript",
	],

    "env": {
        "browser": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
		"@typescript-eslint/eslint-plugin",
        /* "@typescript-eslint/tslint" */
	],
	"overrides": [
		{
			"files": ["**/*.tsx"],
			"rules": {
				"react/prop-types": "off"
			}
		}
	],
    "rules": {
		"react/static-property-placement": 0,
		"lines-between-class-members": ["error", "always", { "exceptAfterSingleLine": true}],
		"indent": [2, "tab", { "SwitchCase": 1, "VariableDeclarator": 1 }],
		"react/jsx-indent": [2, "tab"],
		"react/jsx-indent-props": [2, "tab"],
		"no-tabs": 0,
		"space-in-parens": ["error", "always", { "exceptions": ["{}", "[]"] }],
		"no-underscore-dangle": 0,
		"no-floating-decimal": 0,
		"template-curly-spacing": 0,
		"react/jsx-filename-extension": [1, { "extensions": [".js", ".tsx"] }],
		"jsx-a11y/anchor-is-valid": ["error", {
			"components": ["Link"],
			"specialLink": ["to"],
			"aspects": ["noHref", "invalidHref", "preferButton"]
		}],
        "@typescript-eslint/class-name-casing": "error",
        "@typescript-eslint/indent": [
            "error",
            "tab",
            {
                "CallExpression": {
                    "arguments": "first"
                },
                "FunctionDeclaration": {
                    "parameters": "first"
                },
                "FunctionExpression": {
                    "parameters": "first"
                }
            }
        ],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        /* "@typescript-eslint/no-param-reassign": "error", */
        "@typescript-eslint/no-this-alias": "error",
        "@typescript-eslint/quotes": [
            "error",
            "single",
            {
                "avoidEscape": true
            }
        ],
        "@typescript-eslint/semi": [
            "error",
            "always"
        ],
        "arrow-parens": [
            "off",
            "as-needed"
        ],
        "camelcase": "error",
        "capitalized-comments": "error",
        "comma-dangle": [
            "error",
            "always-multiline"
        ],
        "curly": [
            "error",
            "multi-line"
        ],
        "eol-last": "error",
        "eqeqeq": [
            "error",
            "smart"
        ],
        "id-blacklist": [
            "error",
            "any",
            /* "Number", */
            "number",
            "String",
            "string",
            "Boolean",
            "boolean",
            "Undefined",
            "undefined"
        ],
        "id-match": "error",
        "max-len": [
            "error",
            {
                "code": 100
            }
        ],
        "no-duplicate-imports": "error",
        "no-eval": "error",
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 2
            }
        ],
        "no-new-wrappers": "error",
        "no-trailing-spaces": "error",
        "no-underscore-dangle": [
            "error",
            {}
        ],
        "no-var": "error",
        "object-shorthand": "error",
        "one-var": [
            "error",
            "never"
        ],
        "prefer-const": "error",
        "prefer-template": "error",
        "quote-props": [
            "error",
            "as-needed"
        ],
        "radix": "error",
        "space-before-function-paren": [
            "error",
            {
                "anonymous": "always",
                "named": "never"
            }
        ],
        "spaced-comment": "error",
        /* "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                    "array-bracket-spacing": [
                        true,
                        "never"
                    ],
                    "block-spacing": true,
                    "brace-style": [
                        true,
                        "1tbs",
                        {
                            "allowSingleLine": true
                        }
                    ],
                    "function-name": [
                        true,
                        {
                            "method-regex": "^[a-z][\\w\\d]+$",
                            "private-method-regex": "^[a-z][\\w\\d]+$",
                            "protected-method-regex": "^[a-z][\\w\\d]+$",
                            "static-method-regex": "^[A-Z_\\d]+$",
                            "function-regex": "^[a-zA-Z][\\w\\d]+$"
                        }
                    ],
                    "no-boolean-literal-compare": true,
                    "no-else-after-return": true,
                    "no-function-constructor-with-string-args": true,
                    "no-increment-decrement": true,
                    "object-curly-spacing": [
                        true,
                        "always"
                    ],
                    "object-shorthand-properties-first": true,
                    "prefer-array-literal": true,
                    "space-in-parens": [
                        true,
                        "always",
                        {
                            "exceptions": [
                                "{}",
                                "[]"
                            ]
                        }
                    ],
                    "ter-arrow-parens": [
                        true,
                        "as-needed",
                        {
                            "requireForBlockBody": true
                        }
                    ],
                    "ter-computed-property-spacing": true,
                    "ter-func-call-spacing": true,
                    "ter-indent": [
                        true,
                        "tab",
                        4
                    ],
                    "ter-prefer-arrow-callback": true,
                    "whitespace": [
                        true,
                        "check-branch",
                        "check-decl",
                        "check-operator",
                        "check-preblock",
                        "check-separator"
                    ]
                }
            }
        ] */
    }
};
