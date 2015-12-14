require "jsduck/tag/tag"

class UAUAlteracao < JsDuck::Tag::Tag
  def initialize
    @tagname = :alteracao
    @pattern = "alteracao"
    @html_position = POS_DOC + 0.1
    @repeatable = true
	@css = <<-EOCSS
      .inner-box {
        border-color: orange;
      }
    EOCSS
	super
  end

  def parse_doc(scanner, position)
    dataAlteracao = scanner.match(/\S*/)
    scanner.hw
    numProjeto = scanner.match(/\S*/)
	scanner.hw 
	tipoProjeto = scanner.match(/\S*/)
	scanner.hw
	autor = scanner.match(/.*$/)
    return { :tagname => :alteracao, :dataAlteracao => dataAlteracao, :numProjeto => numProjeto, :tipoProjeto => tipoProjeto, :autor => autor, :doc => :multiline }
  end

  def process_doc(context, alteracao_tags, position)
    context[:alteracao] = alteracao_tags.map {|tag| " Data: #{tag[:dataAlteracao]}<\BR> Número da tarefa: #{tag[:numProjeto]}<\BR> Tipo da tarefa: #{tag[:tipoProjeto]} <\BR>Desenvolvedor: #{tag[:autor]}</BR> Descrição: #{tag[:doc]}" }
  end

  def to_html(context)
    alteracoes = context[:alteracao].map {|alteracao| "#{alteracao}" }.join(" </BR></BR> ")
    <<-EOHTML
	  <div class='rounded-box inner-box'>
	  <h2>Alterações</h2></BR>
      #{alteracoes}
	  </div>
    EOHTML
  end
end