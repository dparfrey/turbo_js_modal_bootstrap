class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  # GET /posts
  # GET /posts.json
  def index
    @posts = Post.all.order(created_at: :desc)
  end

  def show; end

  def new
    @post = Post.new
    render layout: false
  end

  def edit
    render layout: false
  end

  def create
    @post = Post.new(post_params)

    respond_to do |format|
      if @post.save
        format.html { head :no_content }
        # format.html { redirect_to posts_url, notice: 'Post was successfully added.' }
      else
        Rails.logger.error(@post.errors.full_messages)
        # head :no_content
        render layout: false, status: unprocessable_entity
      end
    end
  end

  def update
    respond_to do |format|
      if @post.update(post_params)
        format.html { render layout: false }
        # format.turbo_stream { render turbo_stream: turbo_stream.update(@post) }
        # format.html { redirect_to posts_url, notice: 'Post was successfully updated.', status: :unprocessable_entity }
      else
        # format.turbo_stream do
        #   render turbo_stream: turbo_stream.replace('post-modal-form',
        #                                             partial: 'posts/modal_add_edit_form',
        #                                             locals: { post: @post, reloading: true })
        # end

        Rails.logger.error(@post.errors.full_messages)
        # head :no_content
        render layout: false, status: unprocessable_entity
      end
    end
  end

  def destroy
    @post.destroy
    respond_to do |format|
      # format.turbo_stream { render turbo_stream: turbo_stream.remove(@post) }
      format.html { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_post
    @post = Post.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def post_params
    params.require(:post).permit(:title, :body)
  end
end
