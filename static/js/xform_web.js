// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $(function() {
    var App, item_dict, mobileView, renderedForm, swipeFrame, xFormModel, xFormView, _data, _fieldsets, _schema;
    mobileView = false;
    _fieldsets = [];
    _schema = {};
    _data = {};
    item_dict = {};
    swipeFrame = null;
    renderedForm = null;
    xFormModel = (function(_super) {

      __extends(xFormModel, _super);

      function xFormModel() {
        return xFormModel.__super__.constructor.apply(this, arguments);
      }

      xFormModel.prototype.defaults = {
        id: null,
        children: []
      };

      return xFormModel;

    })(Backbone.Model);
    xFormView = (function(_super) {

      __extends(xFormView, _super);

      function xFormView() {
        return xFormView.__super__.constructor.apply(this, arguments);
      }

      xFormView.prototype.el = $('#xform_view');

      xFormView.prototype.model = new xFormModel();

      xFormView.prototype.events = {
        'click #submit-xform': 'validate'
      };

      xFormView.prototype.initialize = function() {
        this.form_id = $('#form_id').html();
        this.listenTo(this.model, 'change', this.render);
        this.model.fetch({
          url: "/api/v1/forms/" + this.form_id + "/?user=admin&key=35ec69714b23a33e79b0d859f51fa458&format=json"
        });
        return this;
      };

      xFormView.prototype.passesConstraint = function(question, answers) {
        var constraint, expression, passesConstraint;
        passesConstraint = true;
        if (question.bind && question.bind.constraint) {
          constraint = question.bind.constraint;
          expression = this.evaluateSelectedInExpression(constraint, answers, question["name"]);
          return this.evaluateExpression(expression, answers, question["name"]);
        }
        return passesConstraint;
      };

      xFormView.prototype.isRelevant = function(question, answers) {
        var containsRelevant, expression, relevantString;
        containsRelevant = question.bind && question.bind.relevant;
        if (containsRelevant) {
          relevantString = question.bind.relevant;
          expression = relevantString.replace(/\./, question["name"]);
          expression = this.evaluateSelectedInExpression(expression, answers, question["name"]);
          return this.evaluateExpression(expression, answers, question["name"]);
        } else {
          return true;
        }
      };

      xFormView.prototype.evaluateSelectedInExpression = function(expression, answers, currentPath) {
        var answer, components, endRange, keepGoing, leftString, range, replaceString, rightString, selected, string, substring;
        keepGoing = true;
        string = expression;
        while (keepGoing) {
          range = expression.indexOf("selected(");
          if (range !== -1) {
            substring = expression.slice(range + 9);
            endRange = substring.indexOf(")");
            selected = substring.slice(0, +endRange + 1 || 9e9);
            components = selected.split(",");
            leftString = components[0].replace(/^\s+|\s+$/g, "");
            rightString = components[0].replace(/^\s+|\s+$/g, "");
            if (leftString === ".") {
              leftString = currentPath;
            }
            rightString = rightString.slice(1, +(rightString.length - 2) + 1 || 9e9);
            answer = answers[leftString];
            replaceString = expression.slice(range, +endRange + 1 || 9e9);
            if (answer === rightString) {
              string = string.replace(replaceString, "YES");
            } else {
              string = string.replace(replaceString, "NO");
            }
          } else {
            keepGoing = false;
          }
        }
        return string;
      };

      xFormView.prototype.evaluateExpression = function(expression, answers, currentPath) {
        var andLocation, andRange, closeRange, leftExpression, leftOverString, newExpression, notRange, orLocation, orRange, parentString, range, rangeLength, rightExpression, scopeRange;
        scopeRange = expression.indexOf("(");
        andRange = expression.indexOf(" and ");
        orRange = expression.indexOf(" or ");
        notRange = expression.indexOf("not(", 0);
        range = scopeRange;
        rangeLength = 1;
        if (andRange !== -1 && andRange < range) {
          range = andRange;
          rangeLength = 5;
        }
        if (orRange !== -1 && orRange < range) {
          range = orRange;
          rangeLength = 4;
        }
        if (notRange !== -1 && notRange < range) {
          range = notR;
          rangeLength = 4;
        }
        if (range !== -1) {
          if (range === scopeRange) {
            closeRange = expression.lastIndexOf(")");
            parentString = expression.slice(range + 1, +(closeRange - range - 2) + 1 || 9e9);
            if (closeRange < (expression.length - 1)) {
              leftOverString = expression.slice(closeRange + 1);
              orLocation = leftOverString.indexOf(" or ");
              andLocation = leftOverString.indexOf(" and ");
              if (orLocation !== 0) {
                return this.evaluateExpression(parentrString, answers, currentPath) || evaluateExpression(leftOverString, answers, currentPath);
              } else if (andLocation !== 0) {
                return this.evaluateExpression(parentrString, answers, currentPath) && evaluateExpression(leftOverString, answers, currentPath);
              } else if (andLocation !== -1 || orLocation !== -1) {
                return this.evaluateExpression(parentString, answers, currentPath);
              }
            } else {
              return this.evaluateExpression(parentString, answers, currentPath);
            }
          } else if (range === andRange) {
            leftExpression = expression.slice(0, +range + 1 || 9e9);
            rightExpression = expression.slice(range + rangeLength);
            return this.evaluateExpression(leftExpression, answers, currentPath) && evaluateExpression(rightExpression, answers, currentPath);
          } else if (range === orRange) {
            leftExpression = expression.slice(0, +range + 1 || 9e9);
            rightExpression = expression.slice(range + rangeLength);
            return this.evaluateExpression(leftExpression, answers, currentPath) || evaluateExpression(rightExpression, answers, currentPath);
          } else if (range === notRange) {
            closeRange = expression.lastIndexOf(")");
            newExpression = expression.slice(range + rangeLength, +(closeRange - (range + rangeLength)) + 1 || 9e9);
            return !(this.evaluateExpression(newExpression, answers, currentPath));
          }
        } else {
          return this.passesTest(expression, answers, currentPath);
        }
        return true;
      };

      xFormView.prototype.passesTest = function(expression, answers, currentPath) {
        var compareString, comps, lName, leftAnswer, leftAnwer, leftFloat, leftString, number, rName, rightAnswer, rightFloat, rightString;
        if (expression === "YES") {
          return true;
        } else if (expression === "NO") {
          return false;
        }
        if ((expression.indexOf("<=")) !== -1) {
          compareString = "<=";
        } else if ((expression.indexOf(">=")) !== -1) {
          compareString = ">=";
        } else if ((expression.indexOf("!=")) !== -1) {
          compareString = "!=";
        } else if ((expression.indexOf("=")) !== -1) {
          compareString = "=";
        } else if ((expression.indexOf("<")) !== -1) {
          compareString = "<";
        } else if ((expression.indexOf(">")) !== -1) {
          compareString = ">";
        } else {
          return true;
        }
        comps = expression.split(compareString);
        leftString = comps[0].replace(/^\s+|\s+$/g, "");
        if (leftString === ".") {
          leftString = currentPath;
        }
        rightString = comps[1].replace(/^\s+|\s+$/g, "");
        leftAnwer = null;
        rightAnswer = null;
        if ((leftString.indexOf("$")) !== -1) {
          lName = leftString.slice(2, leftString.length - 1);
          leftAnswer = answers[lName];
          if (leftAnswer instanceof Array) {
            leftAnswer = "''";
          }
        } else {
          return false;
        }
        if ((rightString.indexOf("$")) !== -1) {
          rName = rightString.slice(2, rightString.length - 1);
          rightAnswer = answers[rName];
          if (rightAnswer instanceof Array) {
            rightAnswer = "''";
          }
        } else {
          rightAnswer = rightString;
        }
        if (leftAnswer === null || rightAnswer === null) {
          if (leftAnswer !== null) {
            if (compareString === "!=") {
              return true;
            }
          } else if (rightAnswer !== null) {
            if (compareString === "!=" && rightAnswer === "''") {
              return false;
            } else if (compareString === "=" && rightAnswer === "''") {
              return true;
            } else if (compareString === "!=") {
              return true;
            }
          } else {
            if (compareString === "=") {
              return true;
            }
          }
          return false;
        }
        if (rightAnswer === "today()") {
          return false;
        } else {
          number = parseInt(rightAnswer);
          if (!(isNaN(number))) {
            leftFloat = parseFloat(leftAnswer);
            rightFloat = parseFloat(rightAnswer);
            if (compareString === "<") {
              return leftFloat < rightFloat;
            } else if (compareString === ">") {
              return leftFloat > rightFloat;
            } else if (compareString === "=") {
              return leftFloat === rightFloat;
            } else if (compareString === "<=") {
              return leftFloat <= rightFloat;
            } else if (compareString === ">=") {
              return leftFloat >= rightFloat;
            } else {
              return leftFloat !== rightFloat;
            }
          } else {
            rightAnswer = (rightAnswer.split("'"))[1].replace(/^\s+|\s+$/g, "");
            if (compareString === "=") {
              return leftAnswer === rightAnswer;
            } else if (compareString === "!=") {
              return leftAnswer !== rightAnswer;
            } else {
              return false;
            }
          }
        }
      };

      xFormView.prototype.render = function() {
        if (mobileView) {
          this.loadMobileForm();
        } else {
          this.loadForm();
        }
        return this;
      };

      xFormView.prototype.validate = function() {
        var posted_data;
        console.log(renderedForm.getValue());
        posted_data = {
          form: this.form_id,
          values: renderedForm.getValue()
        };
        console.log(posted_data);
        return $.post('/submission', posted_data, null);
      };

      xFormView.prototype.recursiveAdd = function(child) {
        var schema_dict, _ref, _ref1,
          _this = this;
        schema_dict = {
          help: child.hint,
          title: child.label
        };
        if (_fieldsets.length === 0 && mobileView) {
          schema_dict['template'] = 'firstField';
        }
        if ((_ref = child.type) === 'string' || _ref === 'text') {
          schema_dict['type'] = 'Text';
        } else if ((_ref1 = child.type) === 'decimal' || _ref1 === 'int' || _ref1 === 'integer') {
          schema_dict['type'] = 'Number';
        } else if (child.type === 'date') {
          schema_dict['type'] = 'Date';
        } else if (child.type === 'today') {
          schema_dict['type'] = 'Date';
          schema_dict['title'] = 'Today';
        } else if (child.type === 'time') {
          schema_dict['type'] = 'DateTime';
        } else if (child.type === 'trigger') {
          schema_dict['type'] = 'Checkbox';
        } else if (child.type === 'note') {
          schema_dict['type'] = 'Text';
          schema_dict['template'] = 'noteField';
        } else if (child.type === 'datetime') {
          schema_dict['type'] = 'DateTime';
        } else if (child.type === 'select all that apply') {
          schema_dict['type'] = 'Checkboxes';
          schema_dict['options'] = [];
          _.each(child.choices, function(option) {
            return schema_dict['options'].push({
              val: option.name,
              label: option.label
            });
          });
        } else if (child.type === 'group') {
          schema_dict['type'] = 'Text';
          schema_dict['template'] = 'groupBegin';
          _.each(child.children, function(_child) {
            return _this.recursiveAdd(_child);
          });
          schema_dict = {
            type: 'Text',
            help: child.hint,
            title: child.label,
            template: 'groupEnd'
          };
          item_dict[child.name + '-end'] = schema_dict;
          _fieldsets.push(child.name + '-end');
          return this;
        } else if (child.type === 'select one') {
          schema_dict['type'] = 'Select';
          schema_dict['options'] = [];
          _.each(child.choices, function(option) {
            return schema_dict['options'].push({
              val: option.name,
              label: option.label
            });
          });
        } else {
          schema_dict['type'] = 'Text';
          schema_dict['template'] = 'unsupportedField';
        }
        item_dict[child.name] = schema_dict;
        _fieldsets.push(child.name);
        _data[child.name] = child["default"];
        return this;
      };

      xFormView.prototype.loadMobileForm = function() {
        var _this = this;
        _fieldsets = [];
        _schema = {};
        _data = {};
        item_dict = {};
        swipeFrame = null;
        $(document).bind('touchmove', function(e) {
          return e.preventDefault();
        });
        Backbone.Form.setTemplates({
          fieldset: '<ul>{{fields}}</ul',
          customForm: '<div id="slider2" class="swipe">{{fieldsets}}</div>',
          field: '<li style="display:none;"><label for="{{id}}">{{title}}</label><div>{{editor}}</div><div>{{help}}</div></li>',
          unsupportedField: '<li style="display:none;"><label for="{{id}}">{{title}}</label></li>',
          firstField: '<li style="display:block;"><label for="{{id}}">{{title}}</label><div>{{editor}}</div><div>{{help}}</div></li>',
          noteField: '<li style="display:none;"><label class="control-label" for="{{id}}">{{title}}</label></div></li>',
          groupBegin: '<li style="display:none;"><div class="well"><div><strong>Group: </strong>{{title}}</div></div></li>',
          groupEnd: '<li style="display:none;"><div><strong>Group End: </strong>{{title}}<hr></div></li>'
        });
        _.each(this.model.attributes.children, function(child) {
          return _this.recursiveAdd(child);
        });
        renderedForm = new Backbone.Form({
          template: 'customForm',
          schema: item_dict,
          data: _data,
          fields: _fieldsets
        }).render();
        $('#formDiv').html('');
        $('#formDiv').html(renderedForm.el);
        swipeFrame = new Swipe(document.getElementById('slider2'));
        return this;
      };

      xFormView.prototype.loadForm = function() {
        var answers, child, relevance,
          _this = this;
        _fieldsets = [];
        _schema = {};
        _data = {};
        item_dict = {};
        swipeFrame = null;
        Backbone.Form.setTemplates({
          unsupportedField: '<div class="control-group"><label for="{{id}}"><strong>Unsupported:</strong> {{title}}</label></div>',
          noteField: '<div class="control-group"><strong>Note: </strong>{{title}}</div>',
          groupBegin: '<div class="well"><div><strong>Group: </strong>{{title}}</div></div>',
          groupEnd: '<div><hr></div>'
        });
        _.each(this.model.attributes.children, function(child) {
          return _this.recursiveAdd(child);
        });
        renderedForm = new Backbone.Form({
          schema: item_dict,
          data: _data,
          fields: _fieldsets
        }).render();
        answers = renderedForm.getValue();
        relevance = (function() {
          var _i, _len, _ref, _results;
          _ref = this.model.attributes.children;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            _results.push(child.name + ":" + this.isRelevant(child, answers));
          }
          return _results;
        }).call(this);
        $('#xform_debug').html(JSON.stringify(relevance));
        $('#formDiv').html('');
        $('#formDiv').html(renderedForm.el);
        return this;
      };

      return xFormView;

    })(Backbone.View);
    return App = new xFormView();
  });

}).call(this);
