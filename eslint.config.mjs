/* eslint-disable @typescript-eslint/naming-convention -- using expected rule names */
/* eslint-disable id-length -- using expected rule names */
/* eslint-disable @stylistic/max-len -- rule selectors are sometimes excessively long */
/* eslint-disable max-lines -- configuration file must be long */

/*
 * [todo]:
 * - Any error-making rules related to not-critical errors
 *   should be loosened to warnings
 * - "@stylistic/padding-line-between-statements" should be revised in future,
 *   if any clear patterns of usage are observed
 */

import { fixupPluginRules } from "@eslint/compat"
import stylisticEslint from "@stylistic/eslint-plugin"
import commentsEslint from "eslint-plugin-eslint-comments"
import importEslint from "eslint-plugin-import"
import {
	config,
	parser,
	plugin as typescriptEslint,
} from "typescript-eslint"


const dirname = String(import.meta.dirname)

const pascalCase = "[A-Z][a-z]*(?:[A-Z][a-z]*)*"
const camelCase = "[a-z]+(?:[A-Z][a-z]*)*"
const humpCase = "[A-Za-z]+[a-z]*(?:[A-Z][a-z]*)*"
const snakeLikeCase = "(?:[a-z]+|[A-Z][a-z]+|[A-Z]+)(?:_([a-z]+|[A-Z][a-z]+|[A-Z]+|[0-9]+))*"
const specialCaseRegex = `^(${[
	`__${humpCase}__`,
	`UNSAFE_${humpCase}`,
	`INTERNAL_${humpCase}`,
	`TEST_${snakeLikeCase}`,
	`${humpCase}_on${pascalCase}`,
	`${humpCase}_handler`,
	`${humpCase}_${camelCase}Handler`,
	`Symbol_${camelCase}`,
].join("|")})$`


export default config(

	// Ignore list
	{
		ignores: [ "**/dist/**/*", "**/build/**/*", "**/docs/**/*", "**/*.md" ],
	},

	// Base configuration
	{
		basePath: dirname,
		files: [
			"**/{src,lib,test,examples,scripts,dtslint}/**/*.{ts,tsx,mjs,js,jsx}",
			"eslint.config.mjs",
		],

		languageOptions: {
			parser,
			ecmaVersion: "latest",
			sourceType: "module",
			parserOptions: {
				projectService: {
					allowDefaultProject: [
						"eslint.config.mjs",
					],
				},
				tsconfigRootDir: dirname,
			},
		},

		settings: {
			"import/parsers": {
				"@typescript-eslint/parser": [ ".ts", ".tsx" ],
			},

			"import/resolver": {
				typescript: {
					alwaysTryTypes: true,
				},
			},
		},
	},

	// Build-in : possible problems
	{
		rules: {
			"array-callback-return": [ "error", {
				allowImplicit: false,
				checkForEach: true,
				allowVoid: true,
			}],
			"constructor-super": [ "error" ],
			"for-direction": [ "error" ],
			"getter-return": [ "error" ],
			"no-async-promise-executor": [ "error" ],
			"no-await-in-loop": [ "warn" ],
			"no-class-assign": [ "error" ],
			"no-compare-neg-zero": [ "error" ], // extended by "no-restricted-syntax" custom rule
			"no-cond-assign": [ "error",
				"except-parens",
			],
			"no-const-assign": [ "error" ],
			"no-constant-binary-expression": [ "error" ],
			"no-constant-condition": [ "error" ],
			"no-constructor-return": [ "error" ],
			"no-control-regex": [ "warn" ],
			"no-debugger": [ "error" ],
			"no-dupe-args": [ "error" ],
			"no-dupe-class-members": [ "error" ],
			"no-dupe-else-if": [ "warn" ],
			"no-dupe-keys": [ "error" ],
			"no-duplicate-case": [ "warn" ],
			"no-duplicate-imports": [ "error", {
				includeExports: true,
				allowSeparateTypeImports: true,
			}],
			"no-empty-character-class": [ "warn" ],
			"no-empty-pattern": [ "error" ],
			"no-ex-assign": [ "error" ],
			"no-fallthrough": [ "error", {
				commentPattern: "^ (fallthrough|no-break)",
				allowEmptyCase: true,
				reportUnusedFallthroughComment: true,
			}],
			"no-func-assign": [ "error" ],
			"no-import-assign": [ "error" ],
			"no-inner-declarations": [ "error", "functions" ],
			"no-invalid-regexp": [ "error" ],
			"no-irregular-whitespace": [ "error" ],
			"no-loss-of-precision": [ "warn" ],
			"no-misleading-character-class": [ "warn", {
				allowEscape: true,
			}],
			"no-new-native-nonconstructor": [ "error" ],
			"no-obj-calls": [ "error" ],
			"no-promise-executor-return": [ "error", {
				allowVoid: true,
			}],
			"no-prototype-builtins": [ "warn" ],
			"no-self-assign": [ "error" ],
			"no-self-compare": [ "error" ],
			"no-setter-return": [ "error" ],
			"no-sparse-arrays": [ "warn" ],
			"no-template-curly-in-string": [ "warn" ],
			"no-this-before-super": [ "error" ],
			"no-unassigned-vars": [ "warn" ],
			"no-undef": [ "off" ], // rule marks known global objects, like `console`
			"no-unexpected-multiline": [ "error" ],
			"no-unmodified-loop-condition": [ "error" ],
			"no-unreachable": [ "error" ],
			"no-unreachable-loop": [ "error" ],
			"no-unsafe-finally": [ "error" ],
			"no-unsafe-negation": [ "error" ],
			"no-unsafe-optional-chaining": [ "error" ],
			"no-unused-private-class-members": [ "error" ],
			"no-unused-vars": [ "off", { // delegated to "@typescript-eslint/..."
				args: "all",
				varsIgnorePattern: "^_[A-Za-z]",
				argsIgnorePattern: "(?:^_[A-Za-z])|(?:^_$)|(?:^this$)",
				ignoreClassWithStaticInitBlock: true,
				reportUsedIgnorePattern: true,
			}],
			"no-use-before-define": [ "off" ], // delegated to "@typescript-eslint/..."
			"no-useless-assignment": [ "error" ],
			"no-useless-backreference": [ "error" ],
			"require-atomic-updates": [ "error" ],
			"use-isnan": [ "error" ],
			"valid-typeof": [ "error", {
				requireStringLiterals: true,
			}],
		},
	},

	// Build-in : suggestions
	{
		rules: {
			"accessor-pairs": [ "warn" ],
			"arrow-body-style": [ "warn", "as-needed" ],
			"block-scoped-var": [ "off" ], // hoisting is good actually, when using with try-catch
			camelcase: [ "off", { // delegated to "@typescript-eslint/naming-convention"
				properties: "always",
				ignoreDestructuring: false,
				ignoreImports: true,
				ignoreGlobals: true,
				allow: [
					"^UNSAFE_.*", // allow unsafe features
					"^TEST_", // allow tests like `TEST__that_this_is_true`
					"_on[A-Z][a-z]", // allow .NET-style handlers like `actionButton_onClick`
					"[A-Z]?[a-z]+Handler|_handler", // allow .NET-style handlers like `process_messageHandler`
				],
			}],
			"capitalized-comments": [ "off" ], // causes false-positives when commenting-out code
			"class-methods-use-this": [ "warn", {
				ignoreOverrideMethods: false,
			}],
			complexity: [ "warn", 20 ], // will require tweaking
			"consistent-return": [ "error", {
				treatUndefinedAsUnspecified: false,
			}],
			"consistent-this": [ "error",
				"__self__",
			],
			curly: [ "error", "all" ],
			"default-case": [ "error", {
				commentPattern: "^(exhaustive|no-default)",
			}],
			"default-case-last": [ "error" ],
			"default-param-last": [ "off" ], // delegated to "@typescript-eslint/..."
			"dot-notation": [ "off", /* { // delegated to "@typescript-eslint/..."
				allowKeywords: false,
			} */ ],
			eqeqeq: [ "error", "smart" ],
			"func-name-matching": [ "off" ], // this might come handy someway
			"func-names": [ "warn", "as-needed" ],
			"func-style": [ "warn", "expression" ],
			"grouped-accessor-pairs": [ "error", "getBeforeSet" ],
			"guard-for-in": [ "error" ],
			"id-denylist": [ "off" ], // kinda stupid if you are not working with magic names
			"id-length": [ "warn", {
				min: 1, // allow iterator variables, c'mon
				max: 32, // good default
			}],
			"id-match": [ "off" ], // literally why would you need that?
			"init-declarations": [ "off" ], // don't make Virtual Basic out of my JS plz
			"logical-assignment-operators": [ "warn", "always", {
				enforceForIfStatements: true,
			}],
			"max-classes-per-file": [ "off" ], // Java*Script*, not Java
			"max-depth": [ "warn", 6 ],
			"max-lines": [ "warn", 1000 ],
			"max-lines-per-function": [ "warn", {
				max: 100,
				skipBlankLines: true,
				skipComments: true,
			}],
			"max-nested-callbacks": [ "warn", 6 ],
			"max-params": [ "off" /* 8 */ ], // delegated to "@typescript-eslint/..."
			"max-statements": [ "off" ], // why, just why?
			"new-cap": [ "error", {
				capIsNew: false, // JSX, callable classes like `Number(42)`
			}],
			"no-alert": [ "error" ],
			"no-array-constructor": [ "error" ],
			"no-bitwise": [ "off" ], // nah, too restrictive for its own good
			"no-caller": [ "error" ],
			"no-case-declarations": [ "error" ],
			"no-console": [ "error" ], // yeah, use custom logger and disable error in its implementation
			"no-continue": [ "off" ], // that is just silly, continue is easier to reason about
			"no-delete-var": [ "error" ],
			"no-div-regex": [ "warn" ],
			"no-else-return": [ "error", {
				allowElseIf: false,
			}],
			"no-empty": [ "error" ],
			"no-empty-function": [ "error", {
				allow: [
					"constructors",
					"privateConstructors",
					"protectedConstructors",
					"decoratedFunctions",
				],
			}],
			"no-empty-static-block": [ "error" ],
			"no-eq-null": [ "off" ], // actually I want nullish check
			"no-eval": [ "error" ],
			"no-extend-native": [ "off" ], // disabled to allow polyfills and extensions
			"no-extra-bind": [ "error" ],
			"no-extra-boolean-cast": [ "warn", {
				enforceForInnerExpressions: true,
			}],
			"no-extra-label": [ "error" ],
			"no-global-assign": [ "error" ],
			"no-implicit-coercion": [ "error" ],
			"no-implicit-globals": [ "error" ],
			"no-implied-eval": [ "off" ], // delegated to "@typescript-eslint/..."
			"no-inline-comments": [ "off" ], // cannot justify, as it lacks customization in jsx
			"no-invalid-this": [ "off" ], // delegated to "@typescript-eslint/..."
			"no-iterator": [ "error" ],
			"no-label-var": [ "error" ],
			"no-labels": [ "off" ], // this is just stupid and leads to unnecessary boolean variables
			"no-lone-blocks": [ "error" ],
			"no-lonely-if": [ "error" ],
			"no-loop-func": [ "error" ],
			"no-magic-numbers": [ "off" ], // we are not children, this is sometimes ok
			"no-multi-assign": [ "error" ],
			"no-multi-str": [ "error" ],
			"no-negated-condition": [ "warn" ],
			"no-nested-ternary": [ "off" ], // maybe kinda useful in JSX
			"no-new": [ "error" ],
			"no-new-func": [ "error" ],
			"no-new-wrappers": [ "error" ],
			"no-nonoctal-decimal-escape": [ "error" ],
			"no-object-constructor": [ "error" ],
			"no-octal": [ "warn" ],
			"no-octal-escape": [ "warn" ],
			"no-param-reassign": [ "warn" ],
			"no-plusplus": [ "off" ], // nah, this wasn't ever a problem for me
			"no-proto": [ "error" ],
			"no-redeclare": [ "off" ], // would probably break hoists in try-catch
			"no-regex-spaces": [ "warn" ],
			"no-restricted-exports": [ "off" ], // not really useful
			"no-restricted-globals": [ "off" ], // not really useful
			"no-restricted-imports": [ "off" ], // not really useful
			"no-restricted-properties": [ "off" ], // not really useful
			"no-restricted-syntax": [ "error",

				// "no-compare-neg-zero" extension for `===` operator
				{
					selector: "BinaryExpression[operator='==='][right.raw='-0'], BinaryExpression[operator='==='][left.raw='-0']",
					message: "Use `Object.is(x, -0)` instead.",
				},
				{
					selector:
						"BinaryExpression[operator='==='][right.type='UnaryExpression'][right.operator='-'][right.argument.value=0]",
					message: "Use `Object.is(x, -0)` instead.",
				},
				{
					selector:
						"BinaryExpression[operator='==='][left.type='UnaryExpression'][left.operator='-'][left.argument.value=0]",
					message: "Use `Object.is(x, -0)` instead.",
				},

				// "no-compare-neg-zero" extension for `!==` operator
				{
					selector: "BinaryExpression[operator='!=='][right.raw='-0'], BinaryExpression[operator='!=='][left.raw='-0']",
					message: "Use `!Object.is(x, -0)` instead.",
				},
				{
					selector:
						"BinaryExpression[operator='!=='][right.type='UnaryExpression'][right.operator='-'][right.argument.value=0]",
					message: "Use `!Object.is(x, -0)` instead.",
				},
				{
					selector:
						"BinaryExpression[operator='!=='][left.type='UnaryExpression'][left.operator='-'][left.argument.value=0]",
					message: "Use `!Object.is(x, -0)` instead.",
				},

				// disable enums
				{
					selector: "TSEnumDeclaration",
					message: "Native TypeScript enums are considered harmful. Use literal union instead.",
				},

				// "explicit-member-accessibility" negation
				{
					selector: "TSParameterProperty[accessibility=/^(private|protected|public)$/]",
					message: "Avoid TypeScript visibility modifiers. Use native JS semantics.",
				},
				{
					selector: "MethodDefinition[accessibility=/^(private|protected|public)$/]",
					message: "Avoid TypeScript visibility modifiers. Use native JS semantics.",
				},
				{
					selector: "PropertyDefinition[accessibility=/^(private|protected|public)$/]",
					message: "Avoid TypeScript visibility modifiers. Use native JS semantics.",
				},

				// Disabled, as this is actually useful in inheritance scenarios
				// // "@typescript-eslint/method-signature-style" extension for classes
				// {
				// 	selector: "MethodDefinition[kind='method']",
				// 	message: "Shorthand method signature is forbidden. Use a function property instead.",
				// },
			],
			"no-return-assign": [ "error" ],
			"no-script-url": [ "error" ],
			"no-sequences": [ "error", {
				allowInParentheses: true,
			}],
			"no-shadow": [ "warn", {
				builtinGlobals: true,
				hoist: "all",
				ignoreTypeValueShadow: false,

				ignoreFunctionTypeParameterNameValueShadow: false,
			}],
			"no-shadow-restricted-names": [ "error", {
				reportGlobalThis: true,
			}],
			"no-ternary": [ "off" ], // unless JS adds control expressions, this needs to be allowed
			"no-throw-literal": [ "error" ],
			"no-undef-init": [ "off" ], // for now, I'm on edge whether this is good or nah
			"no-undefined": [ "off" ], // this works horrible actually
			"no-underscore-dangle": [ "off" ], // must be off to allow rules like "no-unused-vars"
			"no-unneeded-ternary": [ "error" ],
			"no-unused-expressions": [ "error", {
				allowShortCircuit: true,
				allowTernary: true,
				allowTaggedTemplates: true,
				enforceForJSX: true,
			}],
			"no-unused-labels": [ "error" ],
			"no-useless-call": [ "error" ],
			"no-useless-catch": [ "error" ],
			"no-useless-computed-key": [ "error" ],
			"no-useless-concat": [ "error" ],
			"no-useless-constructor": [ "error" ],
			"no-useless-escape": [ "error" ],
			"no-useless-rename": [ "error" ],
			"no-useless-return": [ "error" ],
			"no-var": [ "off" ], // var is necessary for emulation of control expressions via hoisting
			"no-void": [ "off" ], // not sure if this is really a problem
			"no-warning-comments": [ "warn", {
				terms: [ "[todo]:", "[fixme]:", "[issues]:", "[requests]:" ],
				decoration: [ "*" ],
			}],
			"no-with": [ "error" ],
			"object-shorthand": [ "error", "always", {
				avoidQuotes: false,
			}],
			"one-var": [ "error", "never" ],
			"operator-assignment": [ "error" ],
			"prefer-arrow-callback": [ "warn", {
				allowNamedFunctions: true,
				allowUnboundThis: true,
			}],
			"prefer-const": [ "warn" ],
			"prefer-destructuring": [ "off" ], // delegated to "@typescript-eslint/..."
			"prefer-exponentiation-operator": [ "warn" ],
			"prefer-named-capture-group": [ "off" ], // not my cup of tea
			"prefer-numeric-literals": [ "warn" ],
			"prefer-object-has-own": [ "error" ],
			"prefer-object-spread": [ "warn" ],
			"prefer-promise-reject-errors": [ "error" ],
			"prefer-regex-literals": [ "warn" ],
			"prefer-rest-params": [ "error" ],
			"prefer-spread": [ "error" ],
			"prefer-template": [ "warn" ],
			radix: [ "error" ],
			"require-await": [ "off" ], // promises allow error capture, and are sometimes required by libraries
			"require-unicode-regexp": [ "warn" ],
			"require-yield": [ "error" ],
			"sort-imports": [ "off" ], // delegated to "eslint-plugin-import"
			"sort-keys": [ "off" ], // this is insane idea
			"sort-vars": [ "off" ], // like above
			strict: [ "warn" ], // never used this directive tbh
			"symbol-description": [ "error" ],
			"vars-on-top": [ "off" ], // again, hoisting is good actually
			yoda: [ "error", "never", {
				exceptRange: true,
			}],
		},
	},

	// eslint-comments
	{
		plugins: {
			"eslint-comments": commentsEslint,
		},
		rules: {
			"eslint-comments/require-description": [ "error", {
				ignore: [],
			}],
			"eslint-comments/no-unused-disable": [ "error" ],
		},
	},

	// eslint-import
	{
		plugins: {
			import: fixupPluginRules(importEslint),
		},
		rules: {
			"import/first": [ "error" ],
			"import/newline-after-import": [ "error" ],
			"import/no-duplicates": [ "error" ],
			"import/no-unresolved": [ "warn" ],
			"import/order": [ "warn", {
				groups: [
					"builtin",
					"external",
					[ "unknown", "type" ], // for unassigned or side-effect imports
					"internal",
					"parent",
					"sibling",
					"index",
				],
				pathGroups: [
					{
						pattern: "@/**", // @-aliasing for src
						group: "internal",
						position: "before",
					},
					{
						pattern: "#/**", // #-aliasing for resources
						group: "internal",
						position: "before",
					},
				],
				pathGroupsExcludedImportTypes: [ "builtin", "external" ], // unassigned won't match these
				"newlines-between": "always",
				alphabetize: {
					order: "asc",
					caseInsensitive: true,
				},
				warnOnUnassignedImports: false,
			}],
		},
	},

	// typescript-eslint
	{
		plugins: {
			"@typescript-eslint": typescriptEslint,
		},
		rules: {
			"@typescript-eslint/adjacent-overload-signatures": [ "error" ],
			"@typescript-eslint/array-type": [ "warn", {
				default: "generic",
			}],
			/* type */"@typescript-eslint/await-thenable": [ "warn" ],
			"@typescript-eslint/ban-ts-comment": [ "error", {
				minimumDescriptionLength: 3,
				"ts-check": false,
				"ts-expect-error": { descriptionFormat: "^: (TS|ts)\\(?\\d+\\)? -- .*" },
				"ts-ignore": { descriptionFormat: "^ -- .*" },
				"ts-nocheck": { descriptionFormat: "^ -- .*" },
			}],
			"@typescript-eslint/ban-tslint-comment": [ "error" ],
			"@typescript-eslint/class-literal-property-style": [ "error", "getters" ],
			"@typescript-eslint/class-methods-use-this": [ "off" ], // "class-methods-use-this" is enough
			"@typescript-eslint/consistent-generic-constructors": [ "error", "constructor" ],
			"@typescript-eslint/consistent-indexed-object-style": [ "error", "record" ],
			/* type */"@typescript-eslint/consistent-return": [ "off" ], // current setup is enough
			"@typescript-eslint/consistent-type-assertions": [ "error", {
				assertionStyle: "as",
				objectLiteralTypeAssertions: "allow-as-parameter",
				arrayLiteralTypeAssertions: "allow-as-parameter",
			}],
			"@typescript-eslint/consistent-type-definitions": [ "off" ], // it depends, so rule is off
			/* type */"@typescript-eslint/consistent-type-exports": [ "error", {
				fixMixedExportsWithInlineTypeSpecifier: true,
			}],
			"@typescript-eslint/consistent-type-imports": [ "error", {
				prefer: "type-imports",
				fixStyle: "inline-type-imports",
			}],
			"@typescript-eslint/default-param-last": [ "error" ],
			/* type */"@typescript-eslint/dot-notation": [ "warn", {
				allowKeywords: true,
				allowPrivateClassPropertyAccess: true,
				allowProtectedClassPropertyAccess: true,
				allowIndexSignaturePropertyAccess: true,
			}],
			/* TS-only */"@typescript-eslint/explicit-function-return-type": [ "off" ], // does more harm with complex types, than good
			/* TS-only */"@typescript-eslint/explicit-member-accessibility": [ "off" ], // I want to rely on native semantics only
			/* TS-only */"@typescript-eslint/explicit-module-boundary-types": [ "warn", {
				allowArgumentsExplicitlyTypedAsAny: false,
				allowDirectConstAssertionInArrowFunctions: true,
				allowHigherOrderFunctions: true,
				allowOverloadFunctions: true,
				allowTypedFunctionExpressions: true,
			}],
			"@typescript-eslint/init-declarations": [ "off" ], // turned off just like core version
			"@typescript-eslint/max-params": [ "warn", {
				max: 8,
				countVoidThis: false,
			}],
			"@typescript-eslint/member-ordering": [ "error", {
				default: {
					order: "as-written",
					memberTypes: [

						// Signatures
						"signature",
						"call-signature",

						// Static Fields
						"public-static-field",
						"#private-static-field",
						"static-field",

						// Static Properties
						"public-static-accessor",
						"#private-static-accessor",
						"static-accessor",

						// Static Initialization
						"static-initialization",

						// Static Methods
						"public-static-method",
						"#private-static-method",
						"static-method",

						// Instance Fields
						"public-instance-field",
						"#private-instance-field",
						"instance-field",

						// Abstract Instance Properties
						"public-abstract-accessor",
						"abstract-accessor",

						// Instance Properties
						"public-instance-accessor",
						"#private-instance-accessor",
						"instance-accessor",

						// Instance Fields fallback
						"public-field",
						"#private-field",
						"field",

						// Constructors
						"public-constructor",
						"constructor",

						// Abstract Methods
						"public-abstract-method",
						"abstract-method",

						// Instance Methods
						"public-instance-method",
						"#private-instance-method",
						"instance-method",

						// Fallback
						"method",
					],
				},
				interfaces: {
					order: "as-written",
					memberTypes: [

						// Constructors
						"constructor",

						// Signatures
						"signature",

						// Instance Fields fallback
						"field",

						// Fallback
						"method",
					],
				},
				typeLiterals: {
					order: "as-written",
					memberTypes: [

						// Constructors
						"constructor",

						// Signatures
						"signature",

						// Instance Fields fallback
						"field",

						// Fallback
						"method",
					],
				},
			}],
			"@typescript-eslint/method-signature-style": [ "error", "property" ],
			/* type */"@typescript-eslint/naming-convention": [ "error",
				// Allow special cases to bypass formatting
				{
					selector: "default",
					filter: {
						regex: specialCaseRegex,
						match: true,
					},
					format: null,
				},

				// Classes, interfaces, enums
				{
					selector: [ "class", "interface", "enum" ],
					format: [ "PascalCase" ],
					filter: {
						regex: specialCaseRegex,
						match: false,
					},
				},

				// Types
				{
					selector: "typeAlias",
					format: [ "camelCase", "PascalCase" ],
					filter: {
						regex: specialCaseRegex,
						match: false,
					},
				},

				// Imports
				{
					selector: "import",
					format: [ "camelCase", "PascalCase" ],
					filter: {
						regex: specialCaseRegex,
						match: false,
					},
				},

				// Variables
				{
					selector: "variable",
					format: [ "camelCase", "PascalCase" ],
					leadingUnderscore: "allow",
					filter: {
						regex: specialCaseRegex,
						match: false,
					},
				},

				// Properties (object literals, class fields)
				{
					selector: "property",
					format: [ "camelCase" ],
					leadingUnderscore: "allow",
					filter: {
						regex: specialCaseRegex,
						match: false,
					},
				},

				// Methods
				{
					selector: "method",
					format: [ "camelCase", "PascalCase" ],
					leadingUnderscore: "allow",
					filter: {
						regex: specialCaseRegex,
						match: false,
					},
				},

				// Parameters
				{
					selector: "parameter",
					format: [ "camelCase" ],
					leadingUnderscore: "allow",
					filter: {
						regex: specialCaseRegex,
						match: false,
					},
				},

				// Member-like (fields, accessors)
				{
					selector: "memberLike",
					format: [ "camelCase" ],
					leadingUnderscore: "allow",
					filter: {
						regex: specialCaseRegex,
						match: false,
					},
				},

				// Enum members
				{
					selector: "enumMember",
					format: [ "PascalCase", "UPPER_CASE" ],
					filter: {
						regex: specialCaseRegex,
						match: false,
					},
				},
			],
			"@typescript-eslint/no-array-constructor": [ "off" ], // base rule actually works in typescript
			/* type */"@typescript-eslint/no-array-delete": [ "error" ],
			/* type */"@typescript-eslint/no-base-to-string": [ "error" ],
			"@typescript-eslint/no-confusing-non-null-assertion": [ "error" ],
			/* type */"@typescript-eslint/no-confusing-void-expression": [ "error", {
				ignoreArrowShorthand: true,
				ignoreVoidOperator: true,
			}],
			/* type */"@typescript-eslint/no-deprecated": [ "error" ],
			"@typescript-eslint/no-dupe-class-members": [ "off" ], // base rule works enough, but actually overloads are disabled by other rules
			"@typescript-eslint/no-duplicate-enum-values": [ "warn" ],
			/* type */"@typescript-eslint/no-duplicate-type-constituents": [ "error" ],
			"@typescript-eslint/no-dynamic-delete": [ "off" ], // this is actually useful with Proxy API
			"@typescript-eslint/no-empty-function": [ "off" ], // this is probably covered by base rule
			"@typescript-eslint/no-empty-interface": [ "off" ], // deprecated
			"@typescript-eslint/no-empty-object-type": [ "error", {
				allowInterfaces: "with-single-extends",
			}],
			"@typescript-eslint/no-explicit-any": [ "error", {
				ignoreRestArgs: true,
			}],
			"@typescript-eslint/no-extra-non-null-assertion": [ "error" ],
			"@typescript-eslint/no-extraneous-class": [ "warn", { // needs further tweaking after some usage
				allowConstructorOnly: false,
				allowEmpty: true,
				allowStaticOnly: false,
				allowWithDecorator: true,
			}],
			/* type */"@typescript-eslint/no-floating-promises": [ "error", {
				allowForKnownSafeCalls: [],
				allowForKnownSafePromises: [],
				checkThenables: true,
				ignoreIIFE: false,
				ignoreVoid: true,
			}],
			/* type */"@typescript-eslint/no-for-in-array": [ "error" ],
			/* type */"@typescript-eslint/no-implied-eval": [ "error" ],
			"@typescript-eslint/no-import-type-side-effects": [ "error" ],
			"@typescript-eslint/no-inferrable-types": [ "warn", {
				ignoreParameters: true,
				ignoreProperties: true,
			}],
			"@typescript-eslint/no-invalid-this": [ "error" ],
			"@typescript-eslint/no-invalid-void-type": [ "error", {
				allowAsThisParameter: true,
			}],
			"@typescript-eslint/no-loop-func": [ "off" ], // base rule actually works in typescript
			"@typescript-eslint/no-loss-of-precision": [ "off" ], // base rule actually works in typescript
			"@typescript-eslint/no-magic-numbers": [ "off" ], // base rule is disabled as well
			/* type */"@typescript-eslint/no-meaningless-void-operator": [ "off" ], // proven itself to not be helpful
			"@typescript-eslint/no-misused-new": [ "error" ],
			/* type */"@typescript-eslint/no-misused-promises": [ "error" ],
			/* type */"@typescript-eslint/no-misused-spread": [ "error" ],
			/* type */"@typescript-eslint/no-mixed-enums": [ "error" ],
			"@typescript-eslint/no-namespace": [ "off" ], // namespaces are actually good for project-local grouping of surely non-treeshake'able modules - this rule is annoying until typescript introduces directive to give name to namespace imports discoverable by LSPs
			"@typescript-eslint/no-non-null-asserted-nullish-coalescing": [ "error" ],
			"@typescript-eslint/no-non-null-asserted-optional-chain": [ "error" ],
			"@typescript-eslint/no-non-null-assertion": [ "error" ],
			"@typescript-eslint/no-redeclare": [ "off" ], // base rule actually works in typescript
			/* type */"@typescript-eslint/no-redundant-type-constituents": [ "error" ],
			"@typescript-eslint/no-require-imports": [ "error" ],
			"@typescript-eslint/no-restricted-imports": [ "off" ], // base rule is disabled as well
			"@typescript-eslint/no-restricted-types": [ "off" ], // not really useful
			"@typescript-eslint/no-shadow": [ "off" ], // base rule actually works in typescript
			"@typescript-eslint/no-this-alias": [ "error", {
				allowDestructuring: true,
				allowedNames: [ "__self__" ],
			}],
			"@typescript-eslint/no-type-alias": [ "off" ], // not really useful
			/* type */"@typescript-eslint/no-unnecessary-boolean-literal-compare": [ "error" ],
			/* type */"@typescript-eslint/no-unnecessary-condition": [ "error" ],
			"@typescript-eslint/no-unnecessary-parameter-property-assignment": [ "off" ], // using JS-native visibility modifiers
			/* type */"@typescript-eslint/no-unnecessary-qualifier": [ "warn" ],
			/* type */"@typescript-eslint/no-unnecessary-template-expression": [ "off" ], // this removes possibility of implementing something like ".trimIndent()" polyfill on general templates
			/* type */"@typescript-eslint/no-unnecessary-type-arguments": [ "warn" ],
			/* type */"@typescript-eslint/no-unnecessary-type-assertion": [ "error" ],
			"@typescript-eslint/no-unnecessary-type-constraint": [ "warn" ],
			/* type */"@typescript-eslint/no-unnecessary-type-conversion": [ "error" ],
			/* type */"@typescript-eslint/no-unnecessary-type-parameters": [ "warn" ],
			/* type */"@typescript-eslint/no-unsafe-argument": [ "error" ],
			/* type */"@typescript-eslint/no-unsafe-assignment": [ "error" ],
			/* type */"@typescript-eslint/no-unsafe-call": [ "error" ],
			"@typescript-eslint/no-unsafe-declaration-merging": [ "error" ],
			/* type */"@typescript-eslint/no-unsafe-enum-comparison": [ "warn" ],
			"@typescript-eslint/no-unsafe-function-type": [ "error" ],
			/* type */"@typescript-eslint/no-unsafe-member-access": [ "error" ],
			/* type */"@typescript-eslint/no-unsafe-return": [ "error" ],
			/* type */"@typescript-eslint/no-unsafe-type-assertion": [ "off" ], // until this rule provides proper configurations to allow attaching properties to new functions and objects, this is just as annoying as it gets
			/* type */"@typescript-eslint/no-unsafe-unary-minus": [ "error" ],
			"@typescript-eslint/no-unused-expressions": [ "off" ], // base rule actually works in typescript
			"@typescript-eslint/no-unused-vars": [ "error", {
				varsIgnorePattern: "^_[A-Za-z]",
				args: "all",
				argsIgnorePattern: "(?:^_[A-Za-z])|(?:^_$)",
				caughtErrors: "all",
				caughtErrorsIgnorePattern: "",
				reportUsedIgnorePattern: true,
				ignoreClassWithStaticInitBlock: true,
			}],
			"@typescript-eslint/no-use-before-define": [ "error", {
				ignoreTypeReferences: false, // might need disabling if its too annoying
			}],
			"@typescript-eslint/no-useless-constructor": [ "off" ], // due to disabling of typescript-specific visibility modifiers, this does not make sense at all
			"@typescript-eslint/no-useless-empty-export": [ "warn" ],
			"@typescript-eslint/no-var-requires": [ "off" ], // deprecated
			"@typescript-eslint/no-wrapper-object-types": [ "error" ],
			/* type */"@typescript-eslint/non-nullable-type-assertion-style": [ "off" ], // this style of assertion gives opportunity for hiding errors - prefer runtime assertions
			/* type */"@typescript-eslint/only-throw-error": [ "off" ], // not useful, as does not allow for whitelisting classes that implement Error interface
			"@typescript-eslint/parameter-properties": [ "error" ],
			"@typescript-eslint/prefer-as-const": [ "error" ],
			/* type */"@typescript-eslint/prefer-destructuring": [ "warn" ],
			"@typescript-eslint/prefer-enum-initializers": [ "error" ],
			/* type */"@typescript-eslint/prefer-find": [ "warn" ],
			"@typescript-eslint/prefer-for-of": [ "warn" ],
			"@typescript-eslint/prefer-function-type": [ "warn" ],
			/* type */"@typescript-eslint/prefer-includes": [ "warn" ],
			"@typescript-eslint/prefer-literal-enum-member": [ "error", {
				allowBitwiseExpressions: true,
			}],
			"@typescript-eslint/prefer-namespace-keyword": [ "warn" ],
			/* type */"@typescript-eslint/prefer-nullish-coalescing": [ "warn" ],
			/* type */"@typescript-eslint/prefer-optional-chain": [ "warn" ],
			/* type */"@typescript-eslint/prefer-promise-reject-errors": [ "off" ], // not useful, as does not allow for whitelisting classes that implement Error interface
			/* type */"@typescript-eslint/prefer-readonly": [ "warn" ],
			/* type */"@typescript-eslint/prefer-readonly-parameter-types": [ "off" ], // often does not benefit what is worked on, only gives potential for annoying type-duplication
			/* type */"@typescript-eslint/prefer-reduce-type-parameter": [ "warn" ],
			/* type */"@typescript-eslint/prefer-regexp-exec": [ "warn" ],
			/* type */"@typescript-eslint/prefer-return-this-type": [ "error" ],
			/* type */"@typescript-eslint/prefer-string-starts-ends-with": [ "warn" ],
			"@typescript-eslint/prefer-ts-expect-error": [ "off" ], // deprecated
			/* type */"@typescript-eslint/promise-function-async": [ "error", {
			}],
			/* type */"@typescript-eslint/related-getter-setter-pairs": [ "error" ],
			/* type */"@typescript-eslint/require-array-sort-compare": [ "error" ],
			/* type */"@typescript-eslint/require-await": [ "off" ], // turned off just like base rule
			/* type */"@typescript-eslint/restrict-plus-operands": [ "error", {
				allowAny: false,
				allowBoolean: false,
				allowNullish: false,
				allowNumberAndString: false,
				allowRegExp: false,
			}],
			/* type */"@typescript-eslint/restrict-template-expressions": [ "error", {
				allow: [{ name: [ "Error", "URL", "URLSearchParams" ], from: "lib" }],
				allowAny: false,
				allowBoolean: true,
				allowNullish: false,
				allowNumber: true,
				allowRegExp: true,
			}],
			/* type */"@typescript-eslint/return-await": [ "warn", "always" ],
			"@typescript-eslint/sort-type-constituents": [ "off" ], // deprecated
			/* type */"@typescript-eslint/strict-boolean-expressions": [ "off" ], // booleanish semantics are usually useful for shorter conditions
			/* type */"@typescript-eslint/switch-exhaustiveness-check": [ "error" ],
			"@typescript-eslint/triple-slash-reference": [ "error" ],
			"@typescript-eslint/typedef": [ "off" ], // deprecated
			/* type */"@typescript-eslint/unbound-method": [ "error", {
				ignoreStatic: false, // might consider switching to true
			}],
			"@typescript-eslint/unified-signatures": [ "off" ], // overloads are useful when providing alternate documentation - this rule breaks this flow
			/* type */"@typescript-eslint/use-unknown-in-catch-callback-variable": [ "error" ],
		},
	},

	// eslint-stylistic
	{
		plugins: {
			"@stylistic": stylisticEslint,
		},
		rules: {
			"@stylistic/array-bracket-newline": [ "off", { // kinda lame, does not support enough exceptions
				multiline: true,
			}],
			"@stylistic/array-bracket-spacing": [ "error", "always", {
				singleValue: true,
				objectsInArrays: false,
				arraysInArrays: false,
			}],
			"@stylistic/array-element-newline": [ "off", { // this causes more harm that good
				consistent: true,
				multiline: true,
			}],
			"@stylistic/arrow-parens": [ "error", "always" ],
			"@stylistic/arrow-spacing": [ "error", {
				before: true,
				after: true,
			}],
			"@stylistic/block-spacing": [ "error", "always" ],
			"@stylistic/brace-style": [ "error", "1tbs", {
				allowSingleLine: true,
			}],
			"@stylistic/comma-dangle": [ "error", {
				arrays: "always-multiline",
				objects: "always-multiline",
				imports: "always-multiline",
				exports: "always-multiline",
				functions: "always-multiline",
				importAttributes: "always-multiline",
				dynamicImports: "always-multiline",
				enums: "always-multiline",
				generics: "always-multiline",
				tuples: "always-multiline",
			}],
			"@stylistic/comma-spacing": [ "error", {
				before: false,
				after: true,
			}],
			"@stylistic/comma-style": [ "error", "last" ],
			"@stylistic/computed-property-spacing": [ "error", "never" ],
			"@stylistic/curly-newline": [ "off", { // while great in theory, in practice forces lines that are too long
				multiline: true,
				ClassBody: "always",
			}],
			"@stylistic/dot-location": [ "error", "property" ],
			"@stylistic/eol-last": [ "error", "always" ],
			"@stylistic/function-call-argument-newline": [ "error", "consistent" ],
			"@stylistic/function-call-spacing": [ "error", "never" ],
			"@stylistic/function-paren-newline": [ "error", "multiline-arguments" ],
			"@stylistic/generator-star-spacing": [ "error", "after" ],
			"@stylistic/implicit-arrow-linebreak": [ "error", "beside" ],
			"@stylistic/indent": [ "error", "tab", {
				SwitchCase: 1,
				VariableDeclarator: 1,
				outerIIFEBody: 1,
				MemberExpression: 1,
				FunctionDeclaration: {
					parameters: 1,
					body: 1,
				},
				FunctionExpression: {
					parameters: 1,
					body: 1,
				},
				StaticBlock: {
					body: 1,
				},
				CallExpression: {
					arguments: 1,
				},
				ArrayExpression: 1,
				ObjectExpression: 1,
				ImportDeclaration: 1,
				flatTernaryExpressions: true,
				offsetTernaryExpressions: true,
				ignoreComments: false,
				tabLength: 4,
			}], // per-token options might need some revision after using for a while
			"@stylistic/indent-binary-ops": [ "error", "tab" ],
			"@stylistic/jsx-child-element-spacing": [ "error" ],
			"@stylistic/jsx-closing-bracket-location": [ "error", "line-aligned" ],
			"@stylistic/jsx-closing-tag-location": [ "error", "line-aligned" ],
			"@stylistic/jsx-curly-brace-presence": [ "error", {
				propElementValues: "always",
				props: "always",
				children: "ignore",
			}],
			"@stylistic/jsx-curly-newline": [ "error", "consistent" ],
			"@stylistic/jsx-curly-spacing": [ "error", {
				when: "never",
				children: {
					when: "always",
				},
			}],
			"@stylistic/jsx-equals-spacing": [ "error", "never" ],
			"@stylistic/jsx-first-prop-new-line": [ "error", "multiprop" ], // might need changing, need to test in actual react codebase
			"@stylistic/jsx-function-call-newline": [ "error", "multiline" ],
			"@stylistic/jsx-indent": [ "off" ], // deprecated
			"@stylistic/jsx-indent-props": [ "error", "tab" ],
			"@stylistic/jsx-max-props-per-line": [ "error", {
				maximum: 1,
				when: "always",
			}],
			"@stylistic/jsx-newline": [ "error", {
				prevent: true,
			}],
			"@stylistic/jsx-one-expression-per-line": [ "error", {
				allow: "non-jsx",
			}],
			"@stylistic/jsx-pascal-case": [ "error", {
				allowNamespace: true,
			}],
			"@stylistic/jsx-quotes": [ "error", "prefer-double" ],
			"@stylistic/jsx-self-closing-comp": [ "error", {
				component: true,
				html: true,
			}],
			"@stylistic/jsx-sort-props": [ "off" ], // again, sorting props is evil
			"@stylistic/jsx-tag-spacing": [ "error", {
				closingSlash: "never",
				beforeSelfClosing: "always",
				afterOpening: "never",
				beforeClosing: "proportional-always", // needs verification
			}],
			"@stylistic/jsx-wrap-multilines": [ "error", {
				declaration: "parens-new-line",
				assignment: "parens-new-line",
				return: "parens-new-line",
				arrow: "parens-new-line",
				condition: "parens-new-line",
				logical: "parens-new-line",
				prop: "parens-new-line",
				propertyValue: "parens-new-line",
			}],
			"@stylistic/key-spacing": [ "error", {
				beforeColon: false,
				afterColon: true,
			}],
			"@stylistic/keyword-spacing": [ "error", {
				before: true,
				after: true,
			}],
			"@stylistic/line-comment-position": [ "off" ], // both... both is good
			"@stylistic/linebreak-style": [ "error", "unix" ],
			"@stylistic/lines-around-comment": [ "error", {
				afterBlockComment: false,
				beforeBlockComment: true,
				afterLineComment: false,
				beforeLineComment: false, // FP when commenting code inside method chains etc.
				allowBlockStart: true,
				allowBlockEnd: true,
				allowObjectStart: false,
				allowObjectEnd: false,
				allowArrayStart: false,
				allowArrayEnd: false,
				allowClassStart: true,
				allowClassEnd: false,
				allowEnumStart: false,
				allowEnumEnd: false,
				allowInterfaceStart: false,
				allowInterfaceEnd: false,
				allowModuleEnd: true,
				allowModuleStart: false,
				allowTypeStart: false,
				allowTypeEnd: false,
				afterHashbangComment: true,
				ignorePattern: " *\\^\\?", // TypeScript Twoslash Query comments
			}],
			"@stylistic/lines-between-class-members": [ "error", {
				enforce: [{
					blankLine: "never",
					prev: "field",
					next: "field",
				}, {
					blankLine: "always",
					prev: "*",
					next: "method",
				}],
			}, {
				exceptAfterSingleLine: false,
			}],
			"@stylistic/max-len": [ "error", {
				code: 100,
				tabWidth: 4,
				ignoreStrings: false,
				ignoreTemplateLiterals: false,
			}],
			"@stylistic/max-statements-per-line": [ "error", {
				max: 3, // 3 to allow `try { return JSON.stringify(x) } catch { return String(x) }`
			}],
			"@stylistic/member-delimiter-style": [ "error", {
				multiline: {
					delimiter: "comma",
					requireLast: true,
				},
				singleline: {
					delimiter: "comma",
					requireLast: false,
				},
				multilineDetection: "brackets",
			}],
			"@stylistic/multiline-comment-style": [ "off", "starred-block" ], // unfortunately, breaks code comment-out
			"@stylistic/multiline-ternary": [ "error", "always-multiline" ],
			"@stylistic/new-parens": [ "error", "always" ],
			"@stylistic/newline-per-chained-call": [ "error", {
				ignoreChainWithDepth: 1,
			}],
			"@stylistic/no-confusing-arrow": [ "off" ], // don't believe in this being an issue
			"@stylistic/no-extra-parens": [ "off" ], // not worth using
			"@stylistic/no-extra-semi": [ "error" ],
			"@stylistic/no-floating-decimal": [ "error" ],
			"@stylistic/no-mixed-operators": [ "error" ],
			"@stylistic/no-mixed-spaces-and-tabs": [ "error", "smart-tabs" ],
			"@stylistic/no-multi-spaces": [ "error" ],
			"@stylistic/no-multiple-empty-lines": [ "error", {
				max: 2,
			}],
			"@stylistic/no-tabs": [ "off", { // commenting-out code trips this
				allowIndentationTabs: true,
			}],
			"@stylistic/no-trailing-spaces": [ "error" ],
			"@stylistic/no-whitespace-before-property": [ "error" ],
			"@stylistic/nonblock-statement-body-position": [ "error" ],
			"@stylistic/object-curly-newline": [ "error" ],
			"@stylistic/object-curly-spacing": [ "error", "always", {
				objectsInObjects: false,
			}],
			"@stylistic/object-property-newline": [ "error", {
				allowAllPropertiesOnSameLine: true,
			}],
			"@stylistic/one-var-declaration-per-line": [ "error", "always" ],
			"@stylistic/operator-linebreak": [ "error", "before", {
				overrides: {
					"=": "after",
				},
			}],
			"@stylistic/padded-blocks": [ "off" ], // not useful, as does not allow treating comments like blank lines
			"@stylistic/padding-line-between-statements": [ "off" ], // come back here, this one is big
			"@stylistic/quote-props": [ "error", "as-needed", {
				keywords: false,
				numbers: true,
			}],
			"@stylistic/quotes": [ "error", "double", {
				avoidEscape: false,
				allowTemplateLiterals: "avoidEscape",
			}],
			"@stylistic/rest-spread-spacing": [ "error", "never" ],
			"@stylistic/semi": [ "error", "never", {
				beforeStatementContinuationChars: "always",
			}],
			"@stylistic/semi-spacing": [ "error", {
				before: false,
				after: true,
			}],
			"@stylistic/semi-style": [ "error", "first" ],
			"@stylistic/space-before-blocks": [ "error", "always" ],
			"@stylistic/space-before-function-paren": [ "error", {
				anonymous: "always",
				named: "never",
				asyncArrow: "always",
				catch: "never",
			}],
			"@stylistic/space-in-parens": [ "error", "never" ],
			"@stylistic/space-infix-ops": [ "error", {
				int32Hint: false,
				ignoreTypes: true,
			}],
			"@stylistic/space-unary-ops": [ "error", {
				words: true,
				nonwords: false,
			}],
			"@stylistic/spaced-comment": [ "error", "always", {
				block: {
					markers: [ "!" ],
					exceptions: [ "*" ],
					balanced: true,
				},
				line: {
					markers: [ "/" ],
				},
			}],
			"@stylistic/switch-colon-spacing": [ "error", {
				before: true,
				after: true,
			}],
			"@stylistic/template-curly-spacing": [ "error", "never" ],
			"@stylistic/template-tag-spacing": [ "error", "never" ],
			"@stylistic/type-annotation-spacing": [ "error", {
				before: false,
				after: true,
				overrides: {
					arrow: "ignore"
				},
			}],
			"@stylistic/type-generic-spacing": [ "error" ],
			"@stylistic/type-named-tuple-spacing": [ "error" ],
			"@stylistic/wrap-iife": [ "error", "inside", {
				functionPrototypeMethods: true,
			}],
			"@stylistic/wrap-regex": [ "off" ], // not an issue
			"@stylistic/yield-star-spacing": [ "error", "after" ],
		},
	},
)
