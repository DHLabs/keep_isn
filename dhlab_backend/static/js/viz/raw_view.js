// Generated by CoffeeScript 1.6.1
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'vendor/underscore', 'vendor/backbone-min', 'masonry'], function($, _, Backbone, Masonry) {
  var RawView;
  RawView = (function(_super) {

    __extends(RawView, _super);

    function RawView() {
      return RawView.__super__.constructor.apply(this, arguments);
    }

    RawView.prototype.name = 'RawView';

    RawView.prototype.el = $('#raw_viz');

    RawView.prototype.events = {
      "click .btn-group > button": "change_viz_type"
    };

    RawView.prototype.media_base = '//d2oeqvnrcsteq9.cloudfront.net/';

    RawView.prototype.column_headers = [
      {
        'name': 'uuid',
        'type': 'text'
      }
    ];

    RawView.prototype.card_tmpl = _.template('<div class=\'card\'>\n    <%= card_image %>\n    <%= card_data %>\n</div>');

    RawView.prototype.card_img_tmpl = _.template('<div class=\'card-image\'>\n    <a href=\'<%= url %>\' target=\'_blank\'>\n        <img src=\'<%= url %>\'>\n    </a>\n</div>');

    RawView.prototype.card_data_tmpl = _.template('<div class=\'card-data\'>\n    <div><%= data %></div>\n</div>');

    RawView.prototype._detect_headers = function(root) {
      var field, _i, _len, _ref, _ref1, _results;
      _results = [];
      for (_i = 0, _len = root.length; _i < _len; _i++) {
        field = root[_i];
        if ((_ref = field.type) === 'group') {
          this._detect_types(field.children);
        }
        if ((_ref1 = field.type) !== 'note') {
          _results.push(this.column_headers.push(field));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    RawView.prototype.initialize = function(options) {
      this.parent = options.parent;
      this.form = options.form;
      this.data = options.data;
      this._detect_headers(this.form.attributes.children);
      return this.render();
    };

    RawView.prototype.change_viz_type = function(event) {
      var viz_type,
        _this = this;
      viz_type = $(event.currentTarget).data('type');
      $('button.active', this.el).removeClass('active');
      $(event.currentTarget).addClass('active');
      return $('div.active').fadeOut('fast', function() {
        $('div.active').removeClass('active');
        $("#raw_" + viz_type).fadeIn('fast').addClass('active');
        if (viz_type === 'grid') {
          return $('#raw_grid').masonry({
            itemSelector: '.card'
          });
        }
      });
    };

    RawView.prototype._render_list = function() {
      var datum, field, row_html, url, value, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
      $('#raw_table > thead > tr').html('');
      _ref = this.column_headers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        $('#raw_table > thead > tr').append("<th>" + field.name + "</th>");
      }
      _ref1 = this.data.models;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        datum = _ref1[_j];
        row_html = '<tr>';
        _ref2 = this.column_headers;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          field = _ref2[_k];
          value = datum.get('data')[field.name];
          if (value == null) {
            row_html += '<td>&nbsp;</td>';
            continue;
          }
          if ((_ref3 = field.type) === 'photo') {
            url = this.media_base + ("" + (datum.get('repo')) + "/" + (datum.get('_id')) + "/" + value);
            row_html += "<td><a href='" + url + "'>" + value + "</a></td>";
          } else {
            row_html += "<td>" + value + "</td>";
          }
        }
        row_html += '</tr>';
        $('#raw_table > tbody').append(row_html);
      }
      $('#raw_table').dataTable({
        'sDom': "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
        'sPaginationType': 'bootstrap',
        'bLengthChange': false,
        'bFilter': false,
        'iDisplayLength': 25
      });
      return $.extend($.fn.dataTableExt.oStdClasses, {
        "sWrapper": "dataTables_wrapper form-inline"
      });
    };

    RawView.prototype._render_grid = function() {
      var datum, field, tmpl_options, url, value, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      _ref = this.data.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        datum = _ref[_i];
        tmpl_options = {
          card_image: '',
          card_data: ''
        };
        _ref1 = this.column_headers;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          field = _ref1[_j];
          value = datum.get('data')[field.name];
          if ((value == null) || value.length === 0) {
            continue;
          }
          if ((_ref2 = field.type) === 'photo') {
            url = this.media_base + ("" + (datum.get('repo')) + "/" + (datum.get('_id')) + "/" + value);
            tmpl_options.card_image = this.card_img_tmpl({
              url: url
            });
          } else {
            tmpl_options.card_data += "<div><strong>" + field.name + ":</strong> " + value + "</div>";
          }
        }
        if (tmpl_options.card_data.length > 0) {
          tmpl_options.card_data = this.card_data_tmpl({
            data: tmpl_options.card_data
          });
        }
        $('#raw_grid').append(this.card_tmpl(tmpl_options));
      }
      return this;
    };

    RawView.prototype.render = function() {
      this._render_list();
      this._render_grid();
      return this;
    };

    return RawView;

  })(Backbone.View);
  return RawView;
});
