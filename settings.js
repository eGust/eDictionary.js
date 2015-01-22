function MyStorage(prefix) {
	if (MyStorage.prototype.get == undefined) {
		var self = MyStorage.prototype;

		function getItem(p, k) {
			var r = localStorage.getItem(p.str+k);
			return r ? JSON.parse(r) : null;
		}

		function setItem(p, k, v) {
			localStorage.setItem(p.str+k, JSON.stringify(v));
		}

		function removeItem(p, k) {
			localStorage.removeItem(p.str+k);
		}

		function getKeys(p, index) {
			function hasPrefix(s) {
				return s.slice(0, p.len) == p.str;
			}

			if (index == undefined)
			{
				var count = localStorage.length, r = [];
				for (var i = 0, idx = 0; i < count; i++)
				{
					var k = localStorage.key(i);
					if (hasPrefix(k))
					{
						r[idx++] = k.slice(p.len);
					}
				}
				return r;
			}

			var count = localStorage.length;
			for (var i = 0, idx = 0; i < count; i++)
			{
				var k = localStorage.key(i);
				if (hasPrefix(k) && idx++ == index)
				{
					return k.slice(p.len);
				}
			}
			return null;
		}

		self.get = function (keys, singleAsDict) {
			var r = {};
			if ( typeof(keys) == "string" ) {
				var v = getItem(this.prefix, keys);
				if (!singleAsDict)
					return v;
				r[keys] = v;
			} else if ( keys instanceof Array || keys instanceof Object) {
				for (var i in keys)
				{
					var k = keys[i];
					r[k] = getItem(this.prefix, k);
				}
			}
			return r;
		};

		self.set = function (keys, values) {
			if ( typeof(keys) == "string" ) {
				r[keys] = setItem(this.prefix, keys, values);
			} else if ( keys instanceof Array && values instanceof Array && keys.length == values.length) {
				for (var i in keys)
				{
					setItem(this.prefix, keys[i], values[i]);
				}
			} else if (keys instanceof Object && values == undefined) {
				for (var k in keys)
				{
					setItem(this.prefix, k, keys[k]);
				}
			}
		};

		self.clear = function() {
			this.remove(this.keys());
		};

		self.remove = function (keys) {
			if ( typeof(keys) == "string" ) {
				removeItem(this.prefix, keys);
			} else if ( keys instanceof Array || keys instanceof Object) {
				for (var i in keys)
				{
					removeItem(this.prefix, keys[i]);
				}
			}
		};

		self.keys = function(index) {
			return getKeys(this.prefix, index);
		};

		self.length = function() {
			return this.keys().length;
		};

		self.getAll = function() {
			return this.get(this.keys());
		}
	}

	if (!(this instanceof MyStorage))
		return new MyStorage(prefix);

	this.prefix = { 'str': prefix, 'len': prefix.length};
}

var myStg = MyStorage('prfx:edictionary@eGust.stg/');

function saveSettings(options)
{
	try {
		myStg.set(options);
	} catch (e) {}
}

function loadSettings(keys)
{
	try {
		return keys ? myStg.get(keys) : myStg.getAll();
	} catch (e) {
		return null;
	}
}
