REPORTER = spec
test:
	$(MAKE) lint
	@NODE_ENV=test NODE_PATH=lib ./node_modules/.bin/mocha -b --reporter $(REPORTER)

lint:
	./node_modules/.bin/standard

test-cov:
	$(MAKE) lint
	@NODE_ENV=test NODE_PATH=lib ./node_modules/.bin/istanbul cover \
	./node_modules/mocha/bin/_mocha -- -R spec

test-ci:
	$(MAKE) lint
	@NODE_ENV=test NODE_PATH=lib XUNIT_FILE=$(CIRCLE_TEST_REPORTS)/mocha.xml \
	./node_modules/.bin/istanbul cover \
	./node_modules/mocha/bin/_mocha --report lcovonly -- -R xunit-file
	./node_modules/.bin/codeclimate-test-reporter < coverage/lcov.info
	cp -av coverage $(CIRCLE_ARTIFACTS)

gen-changelog:
	github_changelog_generator --exclude-labels duplicate,question,invalid,wontfix,admin

.PHONY: test lint test-cov test-ci gen-changelog
