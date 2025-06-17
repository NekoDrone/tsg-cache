.PHONY: build-LibsqlLayer

build-LibsqlLayer:
	pwd
	mkdir -p "$(ARTIFACTS_DIR)/lib"
	cp node_modules/@libsql/linux-x64-gnu/index.node "$(ARTIFACTS_DIR)/lib/"
	cp -r node_modules "$(ARTIFACTS_DIR)/"
	chmod 755 "$(ARTIFACTS_DIR)/lib/index.node"